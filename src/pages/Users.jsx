import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Table,
  Button,
  Group,
  ActionIcon,
  Skeleton,
  Alert,
  Tooltip,
  Modal,
  TextInput,
  PasswordInput,
  Select,
  Badge,
  Center,
  Stack,
  Divider,
  Box,
  Card,
  ThemeIcon,
  Grid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconUserPlus,
  IconTrash,
  IconAlertCircle,
  IconRefresh,
  IconMail,
  IconLock,
  IconUser,
  IconShieldLock,
  IconEdit,
  IconPhone,
  IconUsersGroup,
  IconUserShield,
  IconCrown,
} from "@tabler/icons-react";

import {
  fetchUsers as apiFetchUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "../api/axios.js";

export default function Users() {
  // ==========================================
  // СОСТОЯНИЯ ДАННЫХ
  // ==========================================
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // СОСТОЯНИЯ МОДАЛЬНОГО ОКНА
  // ==========================================
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // БИЗНЕС-ЛОГИКА: ЗАГРУЗКА СОТРУДНИКОВ
  // ==========================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetchUsers();
      
      // 🔥 SENIOR FIX: Глубокое извлечение массива из JSend структуры { data: { users: [...] } }
      let fetchedData = 
        response.data?.data?.users || // Если структура { status, data: { users: [] } }
        response.data?.data ||        // Если структура { status, data: [] }
        response.data?.users ||       // Если структура { users: [] }
        response.data;                // Прямой массив
      
      // Страхуемся, если сервер вернул что-то неожиданное
      if (!Array.isArray(fetchedData)) {
        console.warn("⚠️ API вернул не массив пользователей:", fetchedData);
        fetchedData = [];
      }
      
      setUsers(fetchedData);
    } catch (err) {
      console.error("Ошибка загрузки сотрудников:", err);
      setUsers([]);
      setError(
        "Не удалось подключиться к базе пользователей. Проверьте соединение с сервером.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // 🔥 ЗАЩИТА ДАННЫХ ДЛЯ РЕНДЕРА
  // ==========================================
  // Гарантируем, что для фильтрации всегда используется массив
  const safeUsers = Array.isArray(users) ? users : [];

  const totalUsers = safeUsers.length;
  const ownerCount = safeUsers.filter((u) => u.role === "OWNER").length;
  const adminCount = safeUsers.filter((u) => u.role === "ADMIN").length;
  const managerCount = safeUsers.filter((u) => u.role === "MANAGER").length;

  // ==========================================
  // БИЗНЕС-ЛОГИКА: ОТКРЫТИЕ МОДАЛКИ
  // ==========================================
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setRole(user.role || "MANAGER");
      setPassword("");
    } else {
      setEditingId(null);
      setName("");
      setEmail("");
      setPhone("");
      setRole("MANAGER");
      setPassword("");
    }
    open();
  };

  // ==========================================
  // БИЗНЕС-ЛОГИКА: СОХРАНЕНИЕ
  // ==========================================
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !role) return;
    if (!editingId && !password) {
      alert("При создании нового сотрудника необходимо задать пароль.");
      return;
    }

    setIsSubmitting(true);

    const payload = { name, email, phone, role };
    if (password.trim() !== "") {
      payload.password = password;
    }

    try {
      if (editingId) {
        await apiUpdateUser(editingId, payload);
      } else {
        await apiCreateUser(payload);
      }
      close();
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при сохранении пользователя:", err);
      alert(
        err.response?.data?.message ||
          "Ошибка при сохранении профиля сотрудника. Возможно, email занят.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // БИЗНЕС-ЛОГИКА: УДАЛЕНИЕ
  // ==========================================
  const handleDeleteUser = async (id, userRole) => {
    if (userRole === "OWNER") {
      alert("Удаление Владельца (OWNER) системы невозможно.");
      return;
    }
    
    if (userRole === "ADMIN") {
      alert("Удаление администратора требует прав Владельца.");
    }

    if (!window.confirm("Вы уверены, что хотите закрыть доступ этому сотруднику?")) return;

    try {
      await apiDeleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении:", err);
      alert(err.response?.data?.message || "Не удалось удалить сотрудника.");
    }
  };

  // ==========================================
  // ФОРМАТИРОВАНИЕ И UI-ХЕЛПЕРЫ
  // ==========================================
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderRoleBadge = (role) => {
    switch (role) {
      case "OWNER":
        return <Badge color="yellow" variant="light" leftSection={<IconCrown size={12} />}>Владелец</Badge>;
      case "ADMIN":
        return <Badge color="red" variant="light">Администратор</Badge>;
      case "MANAGER":
      default:
        return <Badge color="gray" variant="light" style={{ color: "#1B2E3D" }}>Менеджер</Badge>;
    }
  };

  const renderRoleIcon = (role) => {
    if (role === "OWNER") return <IconCrown size={18} color="#f59f00" />;
    if (role === "ADMIN") return <IconShieldLock size={18} color="#fa5252" />;
    return <IconUser size={18} color="#868e96" />;
  };

  return (
    <div style={{ fontFamily: '"Google Sans", sans-serif' }}>
      {/* ШАПКА */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} style={{ color: "#1B2E3D" }}>
            Сотрудники и Доступы
          </Title>
          <Text c="dimmed" mt={5}>
            Управление правами доступа к панели администратора
          </Text>
        </div>

        <Group>
          <Tooltip label="Обновить список">
            <ActionIcon variant="default" size="lg" onClick={fetchUsers} loading={loading}>
              <IconRefresh size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Button
            leftSection={<IconUserPlus size={16} />}
            onClick={() => handleOpenModal()}
            style={{ backgroundColor: "#1B2E3D", color: "white", fontWeight: 600 }}
          >
            Добавить сотрудника
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Внимание" color="red" mb="xl" radius="md">
          {error}
        </Alert>
      )}

      {/* АНАЛИТИКА */}
      {!loading && !error && safeUsers.length > 0 && (
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #1B2E3D" }}>
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="dark" variant="light" size={48} radius="md">
                    <IconUsersGroup size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Всего аккаунтов</Text>
                    <Title order={3} style={{ color: "#1B2E3D" }}>{totalUsers}</Title>
                  </div>
                </Group>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #fa5252" }}>
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="red" variant="light" size={48} radius="md">
                    <IconUserShield size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Управляющие (Владелец / Админ)</Text>
                    <Title order={3} style={{ color: "#1B2E3D" }}>{ownerCount + adminCount}</Title>
                  </div>
                </Group>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #868e96" }}>
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="gray" variant="light" size={48} radius="md">
                    <IconUser size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Менеджеры</Text>
                    <Title order={3} style={{ color: "#1B2E3D" }}>{managerCount}</Title>
                  </div>
                </Group>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* ТАБЛИЦА */}
      <Paper withBorder radius="md" shadow="sm" p={0} style={{ overflow: "hidden", backgroundColor: "white" }}>
        {loading ? (
          <div style={{ padding: "20px" }}>
            <Skeleton height={40} mb="sm" />
            <Skeleton height={40} mb="sm" />
            <Skeleton height={40} />
          </div>
        ) : safeUsers.length > 0 ? (
          <>
            {/* ДЕСКТОП */}
            <Box visibleFrom="sm" style={{ overflowX: "auto" }}>
              <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg" style={{ minWidth: 800 }}>
                <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                  <Table.Tr>
                    <Table.Th style={{ color: "#1B2E3D" }}>Сотрудник</Table.Th>
                    <Table.Th style={{ color: "#1B2E3D" }}>Контакты</Table.Th>
                    <Table.Th style={{ color: "#1B2E3D" }}>Роль</Table.Th>
                    <Table.Th style={{ color: "#1B2E3D" }}>Дата добавления</Table.Th>
                    <Table.Th style={{ color: "#1B2E3D", textAlign: "right" }}>Действия</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {safeUsers.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Center w={36} h={36} bg="#f1f3f5" style={{ borderRadius: "50%" }}>
                            {renderRoleIcon(user.role)}
                          </Center>
                          <Text fw={600} size="sm" style={{ color: "#1B2E3D" }}>{user.name}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{user.email}</Text>
                        {user.phone && (
                          <Text size="xs" c="dimmed" mt={2} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <IconPhone size={12} /> {user.phone}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>{renderRoleBadge(user.role)}</Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">{formatDate(user.createdAt)}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <Group gap="xs" justify="flex-end">
                          <Tooltip label="Редактировать">
                            <ActionIcon variant="light" color="blue" onClick={() => handleOpenModal(user)}>
                              <IconEdit size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                          {user.role !== "OWNER" && (
                            <Tooltip label="Удалить">
                              <ActionIcon variant="light" color="red" onClick={() => handleDeleteUser(user.id, user.role)}>
                                <IconTrash size={16} stroke={1.5} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>

            {/* МОБИЛЬНАЯ ВЕРСИЯ */}
            <Box hiddenFrom="sm" p="md" bg="#f8f9fa">
              <Stack gap="sm">
                {safeUsers.map((user) => (
                  <Paper key={user.id} withBorder p="md" radius="md" shadow="sm">
                    <Group justify="space-between" align="flex-start" mb="xs">
                      <Group gap="sm">
                        <Center w={36} h={36} bg="#f1f3f5" style={{ borderRadius: "50%" }}>
                          {renderRoleIcon(user.role)}
                        </Center>
                        <Box>
                          <Text fw={600} size="sm" style={{ color: "#1B2E3D" }}>{user.name}</Text>
                          <Text size="xs" c="dimmed">{formatDate(user.createdAt)}</Text>
                        </Box>
                      </Group>
                      {renderRoleBadge(user.role)}
                    </Group>
                    <Divider my="sm" />
                    <Box mb="md">
                      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Контакты</Text>
                      <Text size="sm">{user.email}</Text>
                      {user.phone && (
                        <Text size="xs" c="blue" mt={2} component="a" href={`tel:${user.phone}`} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <IconPhone size={12} /> {user.phone}
                        </Text>
                      )}
                    </Box>
                    <Group justify="flex-end" gap="xs">
                      <ActionIcon variant="light" color="blue" size="lg" onClick={() => handleOpenModal(user)}>
                        <IconEdit size={18} stroke={1.5} />
                      </ActionIcon>
                      {user.role !== "OWNER" && (
                        <ActionIcon variant="light" color="red" size="lg" onClick={() => handleDeleteUser(user.id, user.role)}>
                          <IconTrash size={18} stroke={1.5} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </>
        ) : (
          <Center style={{ padding: "60px 20px", flexDirection: "column" }}>
            <IconUser size={48} color="#e0e0e0" stroke={1.5} />
            <Text size="lg" fw={500} mt="md" style={{ color: "#1B2E3D" }}>Нет сотрудников</Text>
            <Text c="dimmed" mt={5}>Добавьте менеджеров для работы с заказами.</Text>
          </Center>
        )}
      </Paper>

      {/* МОДАЛЬНОЕ ОКНО */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={3} style={{ color: "#1B2E3D" }}>{editingId ? "Редактировать профиль" : "Добавить сотрудника"}</Title>}
        size="md"
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <form onSubmit={handleSaveUser}>
          <Stack gap="md">
            <TextInput
              label="ФИО сотрудника"
              placeholder="Иван Иванов"
              required
              leftSection={<IconUser size={16} color="#1B2E3D" />}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
            />
            <TextInput
              label="Email (Логин)"
              placeholder="manager@royalbanners.kz"
              type="email"
              required
              leftSection={<IconMail size={16} color="#1B2E3D" />}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
            />
            <TextInput
              label="Телефон"
              placeholder="+7 (777) 000-00-00"
              leftSection={<IconPhone size={16} color="#1B2E3D" />}
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
              styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
            />
            <Select
              label="Роль в системе"
              data={[
                { value: "MANAGER", label: "Менеджер (Обработка заказов)" },
                { value: "ADMIN", label: "Администратор (Полный доступ)" },
                { value: "OWNER", label: "Владелец (Супер-админ)" },
              ]}
              required
              value={role}
              onChange={setRole}
              styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
            />
            <Divider my="xs" label="Смена пароля" labelPosition="center" />
            <PasswordInput
              label={editingId ? "Новый пароль" : "Пароль"}
              placeholder={editingId ? "Оставьте пустым, чтобы не менять" : "Задайте надежный пароль"}
              required={!editingId}
              leftSection={<IconLock size={16} color="#1B2E3D" />}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              styles={{ label: { color: "#1B2E3D", fontWeight: 600 } }}
            />
            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={close}>Отмена</Button>
              <Button type="submit" loading={isSubmitting} style={{ backgroundColor: "#1B2E3D" }}>
                {editingId ? "Сохранить изменения" : "Создать аккаунт"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}