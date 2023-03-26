// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn copy_file_to(source_path: &str, destination_path: &str) -> String {
    match fs::copy(source_path, destination_path) {
        Ok(value) => value.to_string(),
        Err(err) => err.to_string()
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, copy_file_to])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
