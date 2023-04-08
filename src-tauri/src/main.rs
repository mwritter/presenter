// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

#[tauri::command]
fn copy_file_to(source_path: &str, destination_path: &str) -> String {
    match fs::copy(source_path, destination_path) {
        Ok(value) => value.to_string(),
        Err(err) => err.to_string()
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![copy_file_to])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
