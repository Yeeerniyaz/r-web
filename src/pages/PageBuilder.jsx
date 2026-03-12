import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Button,
  Table,
  Badge,
  Group,
  Stack,
  Box,
  ActionIcon,
  Loader,
  Center,
  Modal,
  Switch,
  TextInput,
  Textarea,
  FileInput,
  Paper,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconEye,
  IconEyeOff,
  IconUpload,
  IconRefresh,
  IconAppWindow,
} from "@tabler/icons-react";

// Импортируем готовые методы API из шлюза
import api, {
  fetchAdminBlocks as apiFetchAdminBlocks,
  updatePageBlock as apiUpdatePageBlock,
} from "../api/axios.js";

// ==========================================
// ГЛАВНЫЙ КОМПОНЕНТ: РЕДАКТОР КОНТЕНТА
// ==========================================
export default function PageBuilder() {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Модалка для редактирования
  const [opened, { open, close }] = useDisclosure(false);
  const [editingBlock, setEditingBlock] = useState(null);
  
  // Стейт строго под поля API
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    subtitle: "",
    content: "",
    isActive: true,
  });
  
  // Стейт для загрузки новой картинки
  const [imageFile, setImageFile] = useState(null);

  // ==========================================
  // 1. ЗАГРУЗКА БЛОКОВ
  // ==========================================
  const fetchBlocks = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetchAdminBlocks();
      const fetchedData = res.data?.data || res.data || [];
      
      if (Array.isArray(fetchedData)) {
        // Выводим блоки в том порядке, в котором они были заложены в БД
        const sorted = [...fetchedData].sort((a, b) => a.order - b.order);
        setBlocks(sorted);
      }
    } catch (error) {
      console.error("Ошибка загрузки блоков:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  // ==========================================
  // 2. ОТКРЫТИЕ МОДАЛКИ (ТОЛЬКО РЕДАКТИРОВАНИЕ)
  // ==========================================
  const handleOpenModal = (block) => {
    setImageFile(null); // Очищаем файл при открытии
    setEditingBlock(block);
    setFormData({
      type: block.type || "",
      title: block.title || "",
      subtitle: block.subtitle || "",
      content: block.content || "",
      isActive: block.isActive !== false,
    });
    open();
  };

  // ==========================================
  // 3. СОХРАНЕНИЕ БЛОКА
  // ==========================================
  const handleSave = async () => {
    if (!editingBlock) return;

    try {
      setIsSaving(true);
      
      // Формируем Multipart/Form-Data для бэкенда
      const submitData = new FormData();
      submitData.append("type", formData.type);
      submitData.append("isActive", formData.isActive);
      
      if (formData.title) submitData.append("title", formData.title);
      if (formData.subtitle) submitData.append("subtitle", formData.subtitle);
      if (formData.content) submitData.append("content", formData.content);
      
      // Если пользователь выбрал новую картинку
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // Отправляем изменения на сервер
      await apiUpdatePageBlock(editingBlock.id, submitData);

      // Обновляем список
      await fetchBlocks();
      close();
    } catch (error) {
      console.error("Ошибка сохранения блока:", error);
      alert("Не удалось сохранить блок. Проверьте соединение с сервером.");
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // 4. БЫСТРОЕ ВКЛ/ВЫКЛ БЛОКА (МОМЕНТАЛЬНОЕ СОХРАНЕНИЕ)
  // ==========================================
  const handleToggleActive = async (id, currentStatus) => {
    try {
      // 1. Мгновенно меняем UI (Оптимистичный UI-апдейт)
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, isActive: !currentStatus } : b)));
      
      // 2. Отправляем запрос в фоне на сохранение
      await api.patch(`/pages/blocks/${id}`, { isActive: !currentStatus });
    } catch (error) {
      console.error("Ошибка переключения статуса:", error);
      // Если сервер выдал ошибку — откатываем UI обратно
      fetchBlocks(); 
    }
  };

  return (
    <div style={{ fontFamily: '"Google Sans", sans-serif' }}>
      {/* ========================================== */}
      {/* ШАПКА СТРАНИЦЫ (ЕДИНЫЙ ДИЗАЙН) */}
      {/* ========================================== */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} style={{ color: "#1B2E3D" }}>
            Управление контентом
          </Title>
          <Text c="dimmed" mt={5}>
            Редактируйте тексты, изображения и видимость секций на сайте
          </Text>
        </div>

        <Tooltip label="Обновить данные">
          <ActionIcon
            variant="default"
            size="lg"
            onClick={fetchBlocks}
            loading={isLoading}
          >
            <IconRefresh size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* ========================================== */}
      {/* ОСНОВНАЯ ТАБЛИЦА */}
      {/* ========================================== */}
      <Paper withBorder radius="md" shadow="sm" p={0} style={{ overflow: "hidden", backgroundColor: "white" }}>
        {isLoading ? (
          <div style={{ padding: "40px" }}>
            <Center>
              <Loader size="lg" color="dark" />
            </Center>
          </div>
        ) : blocks.length === 0 ? (
          <Center style={{ padding: "60px 20px", flexDirection: "column" }}>
            <IconAppWindow size={48} color="#e0e0e0" stroke={1.5} />
            <Text size="lg" fw={500} mt="md" style={{ color: "#1B2E3D" }}>
              Блоки не найдены
            </Text>
            <Text c="dimmed" mt={5}>
              Структура страницы пуста. Проверьте базу данных.
            </Text>
          </Center>
        ) : (
          <Box style={{ overflowX: "auto" }}>
            <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg" style={{ minWidth: 700 }}>
              <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                <Table.Tr>
                  <Table.Th style={{ color: "#1B2E3D" }}>Название (Секция)</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D" }}>Изображение</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D" }}>Основной заголовок</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D", textAlign: "center" }}>Отображение на сайте</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D", textAlign: "right" }}>Действия</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {blocks.map((block) => (
                  <Table.Tr key={block.id}>
                    <Table.Td>
                      <Badge color="dark" size="md" radius="sm">
                        {block.type}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      {block.imageUrl ? (
                        <Badge color="blue" variant="light">Загружено</Badge>
                      ) : (
                        <Text size="xs" c="dimmed">Нет</Text>
                      )}
                    </Table.Td>

                    <Table.Td>
                      <Text size="sm" fw={600} lineClamp={1} maw={300} style={{ color: "#1B2E3D" }}>
                        {block.title || "Без заголовка"}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1} maw={300}>
                        {block.subtitle || block.content || "Нет дополнительного текста"}
                      </Text>
                    </Table.Td>

                    <Table.Td style={{ textAlign: "center" }}>
                      <Switch
                        checked={block.isActive}
                        onChange={() => handleToggleActive(block.id, block.isActive)}
                        color="teal"
                        size="md"
                        onLabel={<IconEye size={14} />}
                        offLabel={<IconEyeOff size={14} />}
                        style={{ display: "inline-block" }}
                      />
                    </Table.Td>

                    <Table.Td style={{ textAlign: "right" }}>
                      <Tooltip label="Редактировать контент">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          onClick={() => handleOpenModal(block)}
                        >
                          <IconEdit size={20} stroke={1.5} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* ========================================== */}
      {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ */}
      {/* ========================================== */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Title order={3} style={{ color: "#1B2E3D" }}>
            Редактирование секции: {editingBlock?.type}
          </Title>
        }
        size="lg"
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Stack gap="md">
          
          <Switch
            label={<Text fw={600} style={{ color: "#1B2E3D" }}>Отображать секцию на сайте</Text>}
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.currentTarget.checked })}
            color="teal"
            size="md"
          />

          <TextInput
            label="Основной заголовок (Title)"
            placeholder="Оставьте пустым, чтобы скрыть"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
            styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
          />

          <TextInput
            label="Подзаголовок (Subtitle)"
            placeholder="Короткий поясняющий текст"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.currentTarget.value })}
            styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
          />

          <Textarea
            label="Детальный текст (Content)"
            placeholder="Описание, перечисление преимуществ или массив данных"
            minRows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.currentTarget.value })}
            styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
          />

          <FileInput
            label="Изображение для секции"
            placeholder={editingBlock?.imageUrl ? "Файл уже загружен (нажмите для замены)" : "Выберите фото (JPG, PNG, WEBP)"}
            leftSection={<IconUpload size={16} />}
            value={imageFile}
            onChange={setImageFile}
            accept="image/png,image/jpeg,image/webp"
            clearable
            styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Отмена
            </Button>
            <Button
              size="md"
              loading={isSaving}
              onClick={handleSave}
              style={{ backgroundColor: "#1B2E3D" }}
            >
              Сохранить изменения
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}