import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Button,
  Group,
  ActionIcon,
  Skeleton,
  Alert,
  Tooltip,
  Center,
  Stack,
  Grid,
  Card,
  ThemeIcon,
  Image,
  CopyButton,
  Modal,
  FileButton,
  Box,
  Badge,
} from "@mantine/core";
import {
  IconCloudUpload,
  IconTrash,
  IconAlertCircle,
  IconRefresh,
  IconCopy,
  IconCheck,
  IconPhoto,
  IconZoomIn,
  IconX,
  IconServer,
} from "@tabler/icons-react";

// Используем единый шлюз API
import api from "../api/axios.js";

export default function Media() {
  // ==========================================
  // СОСТОЯНИЯ ДАННЫХ
  // ==========================================
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Лайтбокс (полноэкранный просмотр)
  const [selectedImage, setSelectedImage] = useState(null);

  // ==========================================
  // БИЗНЕС-ЛОГИКА: ЗАГРУЗКА СПИСКА ФАЙЛОВ
  // ==========================================
  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      // Ожидается, что на бэкенде есть роут GET /api/media, который читает папку uploads
      const response = await api.get("/media");
      
      // Бронебойное извлечение массива из ответа
      let fetchedData = 
        response.data?.data?.files || 
        response.data?.data || 
        response.data?.files || 
        response.data;

      if (!Array.isArray(fetchedData)) {
        console.warn("⚠️ API вернул не массив медиафайлов:", fetchedData);
        fetchedData = [];
      }

      // Сортируем новые файлы наверх (по дате или имени)
      fetchedData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      setFiles(fetchedData);
    } catch (err) {
      console.error("Ошибка загрузки медиа:", err);
      setFiles([]);
      setError("Не удалось загрузить медиафайлы. Убедитесь, что эндпоинт /api/media настроен на бэкенде.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // ==========================================
  // БИЗНЕС-ЛОГИКА: ЗАГРУЗКА НОВОГО ФАЙЛА
  // ==========================================
  const handleUpload = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    // Поддерживаем как один файл, так и массив (зависит от FileButton)
    if (Array.isArray(selectedFiles)) {
      selectedFiles.forEach(file => formData.append("file", file));
    } else {
      formData.append("file", selectedFiles);
    }

    try {
      // Отправляем файл на сервер
      await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // После успешной загрузки обновляем галерею
      fetchMedia();
    } catch (err) {
      console.error("Ошибка при загрузке файла:", err);
      alert(err.response?.data?.message || "Ошибка загрузки файла. Возможно, он слишком большой.");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // БИЗНЕС-ЛОГИКА: УДАЛЕНИЕ ФАЙЛА
  // ==========================================
  const handleDelete = async (filename) => {
    if (!window.confirm("Вы уверены, что хотите физически удалить этот файл с сервера? Если он используется на сайте, картинка пропадет.")) return;

    try {
      // Ожидается роут DELETE /api/media/:filename
      await api.delete(`/media/${filename}`);
      setFiles((prev) => prev.filter((f) => f.name !== filename && f.url !== filename));
    } catch (err) {
      console.error("Ошибка при удалении файла:", err);
      alert(err.response?.data?.message || "Не удалось удалить файл. Проверьте права доступа.");
    }
  };

  // ==========================================
  // ХЕЛПЕРЫ
  // ==========================================
  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // Формируем абсолютный URL для копирования
    const baseUrl = import.meta.env.VITE_API_URL || "https://api-r.yeee.kz";
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ==========================================
  // АНАЛИТИКА
  // ==========================================
  const totalFiles = files.length;
  const totalSize = files.reduce((acc, curr) => acc + (curr.size || 0), 0);

  return (
    <div style={{ fontFamily: '"Google Sans", sans-serif', paddingBottom: "50px" }}>
      {/* ========================================== */}
      {/* ШАПКА СТРАНИЦЫ */}
      {/* ========================================== */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} style={{ color: "#1B2E3D" }}>
            Медиабиблиотека
          </Title>
          <Text c="dimmed" mt={5}>
            Централизованное хранилище всех изображений сайта
          </Text>
        </div>

        <Group>
          <Tooltip label="Обновить галерею">
            <ActionIcon variant="default" size="lg" onClick={fetchMedia} loading={loading || uploading}>
              <IconRefresh size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          {/* Кнопка загрузки скрыта под FileButton */}
          <FileButton onChange={handleUpload} accept="image/png,image/jpeg,image/webp,image/svg+xml">
            {(props) => (
              <Button
                {...props}
                loading={uploading}
                leftSection={<IconCloudUpload size={16} />}
                style={{ backgroundColor: "#1B2E3D", color: "#ffffff", fontWeight: 700 }}
              >
                Загрузить файл
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Системное уведомление" color="red" mb="xl" radius="md">
          {error}
        </Alert>
      )}

      {/* ========================================== */}
      {/* СВОДКА СЕРВЕРА */}
      {/* ========================================== */}
      {!loading && !error && (
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #1B2E3D" }}>
              <Group>
                <ThemeIcon color="dark" variant="light" size={48} radius="md">
                  <IconPhoto size={24} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Всего файлов на сервере</Text>
                  <Title order={3} style={{ color: "#1B2E3D" }}>{totalFiles} шт.</Title>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #339af0" }}>
              <Group>
                <ThemeIcon color="blue" variant="light" size={48} radius="md">
                  <IconServer size={24} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Занято места (Оценочно)</Text>
                  <Title order={3} style={{ color: "#1B2E3D" }}>{formatBytes(totalSize) || "Неизвестно"}</Title>
                </div>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* ========================================== */}
      {/* ГАЛЕРЕЯ (СЕТКА ФАЙЛОВ) */}
      {/* ========================================== */}
      {loading ? (
        <Grid gutter="md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton height={220} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      ) : files.length === 0 ? (
        <Paper withBorder p={60} radius="md" bg="white">
          <Center style={{ flexDirection: "column", textAlign: "center" }}>
            <IconCloudUpload size={60} color="#e0e0e0" stroke={1} />
            <Text size="lg" fw={500} mt="md" style={{ color: "#1B2E3D" }}>
              Хранилище пусто
            </Text>
            <Text c="dimmed" mt={5}>
              Загрузите первое изображение для использования на сайте.
            </Text>
            <FileButton onChange={handleUpload} accept="image/png,image/jpeg,image/webp,image/svg+xml">
              {(props) => (
                <Button {...props} mt="lg" style={{ backgroundColor: "#1B2E3D" }}>
                  Выбрать файл
                </Button>
              )}
            </FileButton>
          </Center>
        </Paper>
      ) : (
        <Grid gutter="md">
          {files.map((file, index) => {
            // Фолбэк для имени: если бэкенд шлет url, вытаскиваем имя из него
            const fileName = file.name || file.url?.split('/').pop() || `image_${index}`;
            const fileUrl = file.url || `/uploads/${fileName}`;
            const absoluteUrl = getFullUrl(fileUrl);

            return (
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card
                  shadow="sm"
                  padding="sm"
                  radius="md"
                  withBorder
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                >
                  {/* ИЗОБРАЖЕНИЕ С ЛУПОЙ */}
                  <Card.Section 
                    style={{ position: "relative", cursor: "pointer", overflow: "hidden", backgroundColor: "#f8f9fa" }}
                    onClick={() => setSelectedImage(absoluteUrl)}
                  >
                    <Image
                      src={absoluteUrl}
                      height={160}
                      alt={fileName}
                      fit="contain"
                      fallbackSrc="https://placehold.co/400x300?text=Format+Error"
                      style={{ transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: "6px", display: "flex"
                    }}>
                      <IconZoomIn color="white" size={16} />
                    </div>
                  </Card.Section>

                  {/* ИНФО О ФАЙЛЕ */}
                  <Box mt="md" mb="xs" style={{ flexGrow: 1 }}>
                    <Text fw={600} size="sm" lineClamp={1} title={fileName} style={{ color: "#1B2E3D", wordBreak: "break-all" }}>
                      {fileName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {file.size ? formatBytes(file.size) : "Локальный файл"}
                    </Text>
                  </Box>

                  {/* КНОПКИ ДЕЙСТВИЙ */}
                  <Group grow mt="auto">
                    <CopyButton value={fileUrl} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button
                          color={copied ? "teal" : "gray"}
                          variant={copied ? "light" : "default"}
                          onClick={copy}
                          leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          size="xs"
                        >
                          {copied ? "Скопировано" : "Ссылка"}
                        </Button>
                      )}
                    </CopyButton>
                    
                    <Tooltip label="Удалить файл">
                      <ActionIcon 
                        variant="light" 
                        color="red" 
                        size="lg" 
                        onClick={() => handleDelete(fileName)}
                        style={{ flexGrow: 0.2 }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      )}

      {/* ========================================== */}
      {/* FULLSCREEN LIGHTBOX */}
      {/* ========================================== */}
      <Modal
        opened={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        fullScreen
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{
          inner: { padding: 0 },
          content: { backgroundColor: "rgba(15, 15, 15, 0.95)", color: "white", backdropFilter: "blur(5px)" },
          body: { height: "100vh", display: "flex", flexDirection: "column", padding: 0 },
        }}
      >
        {selectedImage && (
          <>
            <Group justify="flex-end" p="md" style={{ position: "absolute", top: 0, right: 0, width: "100%", zIndex: 10 }}>
              <ActionIcon onClick={() => setSelectedImage(null)} size="xl" variant="transparent" style={{ color: "white" }}>
                <IconX size={32} />
              </ActionIcon>
            </Group>
            <Box style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
              <Image src={selectedImage} style={{ maxHeight: "90vh", maxWidth: "100%", objectFit: "contain" }} />
            </Box>
          </>
        )}
      </Modal>
    </div>
  );
}