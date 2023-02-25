use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::{
    fs,
    io::{self, BufReader, Cursor},
};
use tokio::fs::metadata;
use tokio::{fs::File, io::AsyncWriteExt};

pub const NOTES_WORK_DIR: &str = "../../note-store/notes/";
pub const TAGS_WORK_DIR: &str = "../../note-store/tags/";

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: String,
    pub title: String,
    pub markdown: String,
    pub tags: Vec<Tag>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub id: String,
    pub label: String,
}

pub struct NoteHandler {
    notes: DashMap<String, Note>,
    tags: DashMap<String, Tag>,
}

impl NoteHandler {
    pub fn new() -> NoteHandler {
        NoteHandler {
            notes: DashMap::new(),
            tags: DashMap::new(),
        }
    }

    pub fn load_notes(&self) -> Result<(), io::Error> {
        let files = notes()?;
        for path in files {
            let file = fs::File::open(path)?;
            let reader = BufReader::new(file);
            let note: Note = serde_json::from_reader(reader)?;
            self.notes.insert(note.id.to_owned(), note);
        }
        Ok(())
    }

    pub fn load_tags(&self) -> Result<(), io::Error> {
        let files = tags()?;
        for path in files {
            let file = fs::File::open(path)?;
            let reader = BufReader::new(file);
            let tag: Tag = serde_json::from_reader(reader)?;
            self.tags.insert(tag.id.to_owned(), tag);
        }
        Ok(())
    }

    pub fn print_all(&self) {
        for pair in self.notes.iter() {
            println!("{:?} , {:?}", pair.key(), pair.value())
        }
    }

    pub async fn get_tags(&self) -> Vec<Tag> {
        let mut tags = Vec::new();
        self.tags.iter().for_each(|f| {
            tags.push(Tag {
                id: f.id.to_owned(),
                label: f.label.to_owned(),
            })
        });
        tags
    }

    pub async fn create_note(&self,note: Note) -> Result<(), io::Error> {
        let mut file = get_file(&NOTES_WORK_DIR, &note.id).await?;
        let note = serde_json::to_string(&note).unwrap();
        let mut buf = Cursor::new(note);
        file.write_all_buf(&mut buf).await?;
        Ok(())
    }

    pub async fn create_tag(&self,tag:Tag) ->Result<(),io::Error>{
        let mut file = get_file(&TAGS_WORK_DIR, &tag.id).await?;
        let tag = serde_json::to_string(&tag).unwrap();
        let mut buf = Cursor::new(tag);
        file.write_all_buf(&mut buf).await?;
        Ok(())
    }

    pub async fn init_dir(&self) -> Result<(),std::io::Error>{
        create_folder().await?;
        Ok(())
    }
}

pub async fn get_file(dir: &str,file_name:&str) ->  Result<File, io::Error>{
    let mut path = dir.to_owned();
    path.push_str(file_name);
    let is_exists = is_exists(&path).await;
    let file = match is_exists {
        Ok(()) => open(&path).await?,
        Err(_) => create(&path).await?
    };
    Ok(file)
}

pub async fn is_exists(file_name: &'_ str) -> Result<(), std::io::Error> {
    metadata(file_name).await?;
    Ok(())
}

pub async fn create(file_path: &'_ str) -> Result<File, std::io::Error> {
    let file = File::create(file_path).await?;
    Ok(file)
}

pub async fn create_folder() -> Result<(), std::io::Error> {
    tokio::fs::create_dir_all(NOTES_WORK_DIR).await?;
    tokio::fs::create_dir_all(TAGS_WORK_DIR).await
}

pub async fn open(file_path: &'_ str) -> Result<File, std::io::Error> {
    let file = File::open(file_path).await?;
    Ok(file)
}

fn files(path: &str) -> Result<Vec<PathBuf>, io::Error> {
    Ok(fs::read_dir(path)?
        .into_iter()
        .map(|f| f.unwrap().path())
        .filter(|f| f.is_file())
        .collect())
}

pub fn notes() -> Result<Vec<PathBuf>, io::Error> {
    files(NOTES_WORK_DIR)
}
pub fn tags() -> Result<Vec<PathBuf>, io::Error> {
    files(TAGS_WORK_DIR)
}
