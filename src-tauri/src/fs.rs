use std::{fs, path::PathBuf, io::{self, BufReader}};

use dashmap::DashMap;
use tokio::fs::{metadata,File};
use crate::note::{Note};

pub const WORK_DIR:&str = "../../notes/";

pub async fn is_exists(file_name:&'_ str) -> Result<(),  std::io::Error>{
    metadata(file_name).await?;
    Ok(())
}

pub async fn create(file_path:&'_ str) ->  Result<File,  std::io::Error>{
    let file = File::create(file_path).await?;
    Ok(file)
}

pub async fn create_folder() -> Result<(),std::io::Error>{
    tokio::fs::create_dir_all(WORK_DIR).await
}

pub async fn open(file_path:&'_ str) -> Result<File,  std::io::Error>{
    let file = File::open(file_path).await?;
    Ok(file)
}

pub fn files() -> Result<Vec<PathBuf>, io::Error> {
    Ok(fs::read_dir(WORK_DIR)?.
        into_iter().
        map(|f| f.unwrap().path()).
        filter(|f| f.is_file()).
        collect()
    )
}

pub fn test() -> Result<(), io::Error>{
    let files = files()?;
    for path in files{
        let file = fs::File::open(path)?;
        
    }
    Ok(())
}

struct NoteHandler{
    notes:DashMap<String,Note> 
}

impl NoteHandler{

    pub fn new() -> NoteHandler{
        NoteHandler { notes: DashMap::new() }
    }

    pub fn load_notes(&self) -> Result<(),io::Error>{
        let files = files()?;
        for path in files{
            let file = fs::File::open(path)?;
            let reader = BufReader::new(file);
            let note:Note = serde_json::from_reader(reader)?;
            self.notes.insert(note.id.to_owned(), note);    
        }
        Ok(())
    }

    

    
}