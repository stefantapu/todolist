import { Paper, Box, Typography, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';

// Тип данных для файла, который мы будем хранить в состоянии
type UploadFile = {
  file: File; // сам файл
  preview: string; // ссылка на превью (URL.createObjectURL)
  progress: number; // прогресс загрузки (0–100)
  status: 'idle' | 'uploading' | 'done'; // статус загрузки
  timer?: number; // id интервала, чтобы можно было остановить
};

export const Accept = () => {
  // Список файлов, которые пользователь загрузил
  const [files, setFiles] = useState<UploadFile[]>([]);

  // Функция, которая симулирует процесс загрузки файла
  const simulateUpload = (UploadFile: UploadFile) => {
    UploadFile.status = 'uploading';

    // Каждые 400 мс увеличиваем прогресс на 10%
    const timer = window.setInterval(() => {
      setFiles(prev =>
        prev.map(f =>
          f.file === UploadFile.file
            ? {
                ...f,
                progress: Math.min(f.progress + 10, 100), // ограничиваем 100%
                status: f.progress + 10 >= 100 ? 'done' : 'uploading',
              }
            : f
        )
      );
    }, 400);

    // Сохраняем id таймера, чтобы можно было остановить при удалении файла
    UploadFile.timer = timer;
  };

  // Настройка dropzone
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'], // принимаем только изображения
    },
    maxFiles: 1, // максимум один файл
    maxSize: 5 * 1024 * 1024, // максимум 5 МБ
    onDrop: acceptedFiles => {
      // Преобразуем файлы в UploadFile объекты
      const mapped = acceptedFiles.map(file => {
        const uploadFile: UploadFile = {
          file,
          preview: URL.createObjectURL(file), // создаём ссылку на превью
          progress: 0,
          status: 'idle',
        };

        // Запускаем симуляцию загрузки
        simulateUpload(uploadFile);

        return uploadFile;
      });

      // Сохраняем файлы в состояние
      setFiles(mapped);
    },
  });

  // Удаление файла
  const removeFile = (file: UploadFile) => {
    // Останавливаем таймер прогресса, если он есть
    if (file.timer) {
      clearInterval(file.timer);
    }

    // Удаляем созданный URL превью
    URL.revokeObjectURL(file.preview);

    // Убираем файл из состояния
    setFiles(prev => prev.filter(f => f.file !== file.file));
  };

  // Очистка ресурсов при размонтировании компонента
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.timer) clearInterval(f.timer); // остановка таймеров
        URL.revokeObjectURL(f.preview); // очистка URL
      });
    };
  }, [files]);

  return (
    <Paper elevation={3} sx={{ p: 0 }}>
      {/* Область для перетаскивания файлов */}
      <Box {...getRootProps()} sx={{ p: 4, textAlign: 'center', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <Typography>Drop Files Here</Typography>
      </Box>

      {/* Список загруженных файлов */}
      {files.map(f => (
        <Box
          key={f.file.name}
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          {/* Кнопка удаления файла */}
          <IconButton size="small" onClick={() => removeFile(f)}>
            <CloseIcon />
          </IconButton>

          {/* Превью изображения */}
          <img
            src={f.preview}
            alt={f.file.name}
            style={{
              width: '100%',
              maxHeight: 160,
              objectFit: 'contain',
              borderRadius: 6,
            }}
          />

          {/* Имя файла и размер */}
          <Typography variant="body2">
            {f.file.name} - {(f.file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>

          {/* Прогресс загрузки */}
          <LinearProgress variant="determinate" value={f.progress} sx={{ mt: 1 }} />

          {/* Текст статуса */}
          <Typography variant="caption">
            {f.status === 'done' ? 'Uploaded' : `Loading: ${f.progress}%`}
          </Typography>
        </Box>
      ))}

      {/* Ошибки отклонённых файлов (слишком большой размер, неверный формат и т.д.) */}
      {fileRejections.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {fileRejections.map(({ file, errors }) => (
            <Box key={file.name}>
              <strong>{file.name}</strong>
              {errors.map(err => (
                <Typography key={err.code} color="error">
                  {err.message}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};
