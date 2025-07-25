#!/bin/bash
# Скрипт для запуска сборки с указанием внешних зависимостей

export NODE_OPTIONS="--max-old-space-size=4096"
ng build --configuration=production --aot --preserve-symlinks
