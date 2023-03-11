#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod note;
use tokio::sync::Mutex;

use tauri::Manager;
use tracing::Level;
use tracing::info;
use tracing_subscriber::FmtSubscriber;
use note::{Note,Tag,NoteHandler};
use window_vibrancy::apply_blur;

struct HandlerState{
    handler:Mutex<NoteHandler>
}

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
    let note_handler = HandlerState{
        handler : Mutex::new(
            note::NoteHandler::new()
        )
    };

    init(&note_handler).await;
    
    let subscriber = FmtSubscriber::builder()
                    .with_max_level(Level::TRACE)
                    .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");
    info!("app has started");
    tauri::Builder::default()
        .manage(note_handler)
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
            .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
              .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            window.set_decorations(true)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_note,
            create_tag,
            load_tags,
            load_notes,
            edit_note,
            delete_note,
            edit_tag,
            delete_tag])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    info!("END");
}

#[tauri::command]
async fn create_note(note: Note, state: tauri::State<'_, HandlerState>) -> Result<(), Error> {
    let mut handler = state.handler.lock().await;
    handler.create_note(note).await?;
    Ok(())
}

#[tauri::command]
async fn create_tag(tag: Tag, state: tauri::State<'_, HandlerState>) -> Result<(), Error> {
    let mut handler = state.handler.lock().await;
    handler.create_tag(tag).await?;
    Ok(())
}

#[tauri::command]
async fn load_tags(state: tauri::State<'_, HandlerState>) -> Result<Vec<Tag>, Error> {
     let handler = state.handler.lock().await;
    info!("request to load tags");
    let tags = handler.get_tags().await;
    Ok(tags)
}

#[tauri::command]
async fn load_notes(state: tauri::State<'_, HandlerState>) -> Result<Vec<Note>, Error> {
     let handler = state.handler.lock().await;
    info!("request to load notes");
    let notes = handler.get_notes().await;
    Ok(notes)
}

#[tauri::command]
async fn edit_note(note: Note,state: tauri::State<'_, HandlerState>) -> Result<(), Error> {
    info!("request to edit note");
    let mut handler = state.handler.lock().await;
    handler.edit_note(note).await?;
    Ok(())
}

#[tauri::command]
async fn delete_note(id:String,state: tauri::State<'_, HandlerState>) -> Result<(), Error> {
    info!("request to edit note");
    let mut handler = state.handler.lock().await;
    handler.delete_note(id.as_str()).await?;
    Ok(())
}

#[tauri::command]
async fn edit_tag(tag: Tag,state: tauri::State<'_, HandlerState>) -> Result<(), Error> {
    info!("request to edit note");
    let mut handler = state.handler.lock().await;
    handler.edit_tag(tag).await?;
    Ok(())
}

#[tauri::command]
async fn delete_tag(id:String,state: tauri::State<'_, HandlerState>) -> Result<(), Error> {
    info!("request to edit note");
    let mut handler = state.handler.lock().await;
    handler.delete_tag(id.as_str()).await?;
    Ok(())
}

async fn init(state:&HandlerState){
    let mut handler = state.handler.lock().await;
    
    if let Err(error) = handler.init_dir().await{
        panic!("{}",error);
    }
    if let Err(error) = handler.load_notes(){
        info!("{}",error);
    }
    if let Err(error) = handler.load_tags(){
        info!("{}",error);
    }
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
