use serde::de::{DeserializeOwned};
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::path::PathBuf;
use std::{
    fs,
    io::{self, BufReader, Cursor},
};
use tokio::fs::metadata;
use tokio::{fs::File, io::AsyncWriteExt};

pub const NOTES_WORK_DIR: &str = "../../note-store/notes/";
pub const TAGS_WORK_DIR: &str = "../../note-store/tags/";

#[derive(Debug, Serialize, Deserialize,Clone)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: String,
    pub title: String,
    pub markdown: String,
    pub tags: Vec<Tag>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SimplifiedNote {
    pub id: String,
    pub title: String,
    pub markdown: String,
}

#[derive(Debug, Serialize, Deserialize,Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub id: String,
    pub label: String,
}

pub struct NoteHandler {
    notes: Vec<Note>,
    tags: Vec<Tag>,
}

impl NoteHandler {
    pub fn new() -> NoteHandler {
        NoteHandler {
            notes: Vec::new(),
            tags: Vec::new(),
        }
    }

    pub fn load_notes(&mut self) -> Result<(), Box<dyn Error>> {
        let files = notes()?;
        for path in files {
            let file = fs::File::open(path)?;
            let note = read_json::<Note>(file)?;
            self.notes.push(note);
        }
        Ok(())
    }

    pub fn load_tags(&mut self) -> Result<(), Box<dyn Error>> {
        let files = tags()?;
        for path in files {
            let file = fs::File::open(path)?;
            let tag = read_json::<Tag>(file)?;
            self.tags.push(tag);
        }
        Ok(())
    }

    pub async fn get_tags(&self) -> Vec<Tag> {
        self.tags.to_vec()
    }

    pub async fn get_notes(&self) -> Vec<Note> {
        self.notes.to_vec()
    }

    pub async fn create_note(&self,note: Note) -> Result<(), io::Error> {
        let file = get_file(&NOTES_WORK_DIR, &note.id).await?;
        write_json(&note, file).await?;
        Ok(())
    }

    pub async fn create_tag(&self,tag:Tag) ->Result<(),io::Error>{
        let file = get_file(&TAGS_WORK_DIR, &tag.id).await?;
        write_json(&tag, file).await?;
        Ok(())
    }

    pub async fn edit_note(&mut self,note: Note) -> Result<(), io::Error> {
        let mut path = NOTES_WORK_DIR.to_owned();
        path.push_str(&note.id);
        let file = tokio::fs::OpenOptions::new()
                            .write(true)
                            .truncate(true)
                            .open(path).await?;
        write_json(&note, file).await?;
        self.replace(note);
        Ok(())
    }

    fn replace(&mut self,note:Note) {
        for n in self.notes.iter_mut() {
            if n.id == note.id{
                n.markdown = note.markdown;
                n.title = note.title;
                n.tags = note.tags;
                break;
            }
        }
    }

    pub async fn init_dir(&self) -> Result<(),std::io::Error>{
        create_folder().await?;
        Ok(())
    }

    fn get_tags_from_note(note:&Note) ->Vec<Tag>{
        let mut tags = Vec::new();
        note.tags.iter().for_each(|t| {
            let cln = t.to_owned();
            tags.push(cln);
        });
        tags
    }
    
}

async fn write_json<T:Serialize>(content:&T,mut file:File) -> Result<(), io::Error>{
    let json = serde_json::to_string(content).unwrap();
    let mut buf = Cursor::new(json);
    file.write_all_buf(&mut buf).await?;
    Ok(())
}

fn read_json<T: DeserializeOwned>(file:fs::File) -> Result<T, Box<dyn Error>>{
    let reader = BufReader::new(file);
    let content = serde_json::from_reader(reader)?;
    Ok(content)
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
