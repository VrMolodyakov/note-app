use std::io;

use tokio::fs::{metadata,File, self};

pub const SAVE_DIR:&str = "./notes/";

pub async fn is_exists(file_name:&'_ str) -> Result<(),  std::io::Error>{
    metadata(file_name).await?;
    Ok(())
}

pub async fn create(file_path:&'_ str) ->  Result<File,  std::io::Error>{
    let file = File::create(file_path).await?;
    Ok(file)
}

pub async fn create_folder() -> Result<(),std::io::Error>{
    fs::create_dir_all(SAVE_DIR).await
}

pub async fn write(content:String){
    
} 