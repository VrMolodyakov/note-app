#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;
use tokio::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Note {
    id: String,
    title: String,
    markdown: String,
    tags: Vec<Tag>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Tag {
    id: String,
    label: String,
}

struct InputTx {
    inner: Mutex<mpsc::Sender<Note>>,
}

fn main() {
    let (input_tx, input_rx) = mpsc::channel(1);

    tauri::Builder::default()
        .manage(InputTx {
            inner: Mutex::new(input_tx),
        })
        .invoke_handler(tauri::generate_handler![create_note_command])
        .setup(|app| {
            tauri::async_runtime::spawn(async move { process(input_rx).await });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn create_note_command(note: Note, state: tauri::State<'_, InputTx>) -> Result<(), Error> {
    let input_tx = state.inner.lock().await;
    input_tx.send(note).await?;
    Ok(())
}

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

async fn process(mut input_rx: mpsc::Receiver<Note>) {
    loop {
        tokio::select! {
          note = input_rx.recv() =>{
            println!("was receiver message = {:?} ",note)
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
