#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod fs;
mod note;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use tokio::sync::mpsc;
use tokio::sync::Mutex;
use tracing::Level;
use tracing::info;
use tracing_subscriber::FmtSubscriber;
use std::io::Cursor;
use note::{Note,Tag};

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    SendError(#[from] tokio::sync::mpsc::error::SendError<Note>),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

struct InputTx {
    inner: Mutex<mpsc::Sender<Note>>,
}

#[tokio::main]
async fn main() {
    if let Err(err) = on_startup().await{
        panic!("{}",err);
    }
    let subscriber = FmtSubscriber::builder()
                    .with_max_level(Level::TRACE)
                    .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");
    info!("app has started");
    let (input_tx, input_rx) = mpsc::channel(1);

    tauri::Builder::default()
        .manage(InputTx {
            inner: Mutex::new(input_tx),
        })
        .invoke_handler(tauri::generate_handler![create_note_command])
        .setup(|_app| {
            tauri::async_runtime::spawn(async move { process(input_rx).await });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    info!("END");
}

#[tauri::command]
async fn create_note_command(note: Note, state: tauri::State<'_, InputTx>) -> Result<(), Error> {
    let input_tx = state.inner.lock().await;
    input_tx.send(note).await?;
    Ok(())
}
async fn on_startup() -> Result<(),Error>{
    fs::create_folder().await?;
    Ok(())
}

async fn process(mut input_rx: mpsc::Receiver<Note>) -> Result<(), Error> {
    loop {
        tokio::select! {
          note = input_rx.recv() =>{
            if let Some(note) = note{
                info!("was receiver message = {:?} ",note);
                let mut path = fs::WORK_DIR.to_owned();
                path.push_str(&note.id);
                let is_exists = fs::is_exists(&path).await;
                let mut file:File;
                if let Err(_) = is_exists{
                    file = fs::create(&path).await?;
                }else{
                    file = fs::open(&path).await?;
                }
                let note = serde_json::to_string(&note).unwrap();
                let mut buf = Cursor::new(note);
                file.write_all_buf(&mut buf).await?;
            }
          }
        }
    }
}

#[test]
fn test() {
    let note = Note {
        id: "1".to_string(),
        title: "title".to_string(),
        markdown: "markdown".to_string(),
        tags: vec![Tag {
            id: "tag_id".to_string(),
            label: "label".to_string(),
        }],
    };
    let serialized = serde_json::to_string(&note).unwrap();
    println!("serialized = {}", serialized);
    let deserialized: Note = serde_json::from_str(&serialized).unwrap();
    println!("deserialized = {:?}", deserialized);
}

#[tokio::test]
async fn test_file() {
    if let Err(is_exs) = fs::is_exists("abc.txt").await {
        println!("file exists: {}", is_exs);
    }
}

#[tokio::test]
async fn create_file() {
    if let Ok(file) = fs::create("abc.txt").await {
        println!("file exists: {:?}", file.metadata().await);
    }
}
