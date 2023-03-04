#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod note;
use tauri::Manager;
use tracing::Level;
use tracing::info;
use tracing_subscriber::FmtSubscriber;
use note::{Note,Tag,NoteHandler};
use window_vibrancy::NSVisualEffectMaterial;
use window_vibrancy::apply_blur;
use window_vibrancy::apply_vibrancy;

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    SendNoteError(#[from] tokio::sync::mpsc::error::SendError<Note>),
    #[error(transparent)]
    SendTagError(#[from] tokio::sync::mpsc::error::SendError<Tag>),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tokio::main]
async fn main() {
    let mut note_handler = note::NoteHandler::new();
    if let Err(error) = note_handler.init_dir().await{
        panic!("{}",error);
    }
    if let Err(error) = note_handler.load_notes(){
        info!("{}",error);
    }
    if let Err(error) = note_handler.load_tags(){
        info!("{}",error);
    }

    let subscriber = FmtSubscriber::builder()
                    .with_max_level(Level::TRACE)
                    .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");
    info!("app has started");
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
            .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            window.set_decorations(true)?;
            Ok(())
        })
        .manage(note_handler)
        .invoke_handler(tauri::generate_handler![create_note,create_tag,load_tags,load_notes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    info!("END");
}

#[tauri::command]
async fn create_note(note: Note, handler: tauri::State<'_, NoteHandler>) -> Result<(), Error> {
    handler.create_note(note).await?;
    Ok(())
}

#[tauri::command]
async fn create_tag(tag: Tag, handler: tauri::State<'_, NoteHandler>) -> Result<(), Error> {
    handler.create_tag(tag).await?;
    Ok(())
}

#[tauri::command]
async fn load_tags(handler: tauri::State<'_, NoteHandler>) -> Result<Vec<Tag>, ()> {
    info!("request to load tags");
    let tags = handler.get_tags().await;
    info!("get tags : {:?}",tags);
    Ok(tags)
}

#[tauri::command]
async fn load_notes(handler: tauri::State<'_, NoteHandler>) -> Result<Vec<Note>, ()> {
    info!("request to load tags");
    let tags = handler.get_notes().await;
    info!("get notes : {:?}",tags);
    Ok(tags)
}

#[test]
fn test_serde() {
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

// #[tokio::test]
// async fn test_file() {
//     if let Err(is_exs) = file::is_exists("abc.txt").await {
//         println!("file exists: {}", is_exs);
//     }
// }

// #[tokio::test]
// async fn test_create_file() {
//     if let Ok(file) = file::create("abc.txt").await {
//         println!("file exists: {:?}", file.metadata().await);
//     }
// }
