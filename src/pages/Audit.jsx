import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Table,
  Group,
  ActionIcon,
  Skeleton,
  Alert,
  Tooltip,
  Badge,
  Center,
  Stack,
  Grid,
  TextInput,
  Select,
  Box,
  Code,
  Card,
  ThemeIcon,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconRefresh,
  IconSearch,
  IconHistory,
  IconFilter,
  IconShieldCheck,
  IconActivity,
  IconDatabaseEdit,
} from "@tabler/icons-react";

// Используем единый инстанс API
import api from "../api/axios.js";

export default function Audit() {
  // ==========================================
  // СОСТОЯНИЯ ДАННЫХ
  // ==========================================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // СОСТОЯНИЯ ФИЛЬТРОВ
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");

  // ==========================================
  // ЗАГРУЗКА ЛОГОВ (REAL DATA)
  // ==========================================
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Обращаемся к эндпоинту аудита (должен быть настроен в router)
      const response = await api.get("/audit");
      
      const fetchedData = response.data?.data || response.data || [];
      if (!Array.isArray(fetchedData)) {
        console.warn("⚠️ API вернул не массив логов:", fetchedData);
        setLogs([]);
      } else {
        setLogs(fetchedData);
      }
    } catch (err) {
      console.error("Ошибка загрузки журнала аудита:", err);
      setLogs([]);
      setError("Не удалось загрузить журнал действий. Проверьте соединение с сервером.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // ==========================================
  // ФИЛЬТРАЦИЯ
  // ==========================================
  const processedLogs = logs.filter((log) => {
    // Поиск по имени пользователя, действию или деталям
    const searchString = `
      ${log.user?.name || ""} 
      ${log.user?.email || ""} 
      ${log.action || ""} 
      ${JSON.stringify(log.details || {})}
    `.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    // Фильтр по типу действия (Создание, Удаление, Обновление)
    let matchesAction = true;
    if (actionFilter === "CREATE") matchesAction = log.action?.includes("CREATE");
    if (actionFilter === "UPDATE") matchesAction = log.action?.includes("UPDATE");
    if (actionFilter === "DELETE") matchesAction = log.action?.includes("DELETE");

    // Фильтр по сущности (Пользователь, Портфолио, Заказ и т.д.)
    const matchesEntity = entityFilter === "ALL" ? true : log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  // ==========================================
  // АНАЛИТИКА ЖУРНАЛА
  // ==========================================
  const totalLogs = logs.length;
  const deleteCount = logs.filter(l => l.action?.includes("DELETE")).length;
  const todayLogsCount = logs.filter(l => {
    const today = new Date().toISOString().split('T')[0];
    const logDate = new Date(l.createdAt).toISOString().split('T')[0];
    return today === logDate;
  }).length;

  // ==========================================
  // ХЕЛПЕРЫ ДЛЯ UI
  // ==========================================
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  const getActionBadge = (action) => {
    if (!action) return <Badge color="gray">НЕИЗВЕСТНО</Badge>;
    if (action.includes("CREATE")) return <Badge color="green" variant="light">{action}</Badge>;
    if (action.includes("UPDATE")) return <Badge color="blue" variant="light">{action}</Badge>;
    if (action.includes("DELETE")) return <Badge color="red" variant="filled">{action}</Badge>;
    if (action.includes("LOGIN")) return <Badge color="teal" variant="outline">{action}</Badge>;
    return <Badge color="gray" variant="light">{action}</Badge>;
  };

  // Уникальные сущности для фильтра
  const uniqueEntities = [...new Set(logs.map(l => l.entityType).filter(Boolean))];

  return (
    <div style={{ fontFamily: '"Google Sans", sans-serif' }}>
      {/* ========================================== */}
      {/* ШАПКА СТРАНИЦЫ */}
      {/* ========================================== */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} style={{ color: "#1B2E3D" }}>
            Журнал активности (Аудит)
          </Title>
          <Text c="dimmed" mt={5}>
            Служба безопасности: история действий всех сотрудников в системе
          </Text>
        </div>

        <Tooltip label="Обновить журнал">
          <ActionIcon variant="default" size="lg" onClick={fetchAuditLogs} loading={loading}>
            <IconRefresh size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Внимание" color="red" mb="xl" radius="md">
          {error}
        </Alert>
      )}

      {/* ========================================== */}
      {/* КАРТОЧКИ АНАЛИТИКИ БЕЗОПАСНОСТИ */}
      {/* ========================================== */}
      {!loading && !error && logs.length > 0 && (
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #1B2E3D" }}>
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="dark" variant="light" size={48} radius="md">
                    <IconActivity size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Действий сегодня</Text>
                    <Title order={3} style={{ color: "#1B2E3D" }}>{todayLogsCount}</Title>
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
                    <IconShieldCheck size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Критические (Удаления)</Text>
                    <Title order={3} style={{ color: "#1B2E3D" }}>{deleteCount}</Title>
                  </div>
                </Group>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card withBorder radius="md" p="md" shadow="sm" style={{ borderLeft: "4px solid #339af0" }}>
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="blue" variant="light" size={48} radius="md">
                    <IconDatabaseEdit size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Всего записей в логе</Text>
                    <Title order={3} style={{ color: "#1B2E3D" }}>{totalLogs}</Title>
                  </div>
                </Group>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* ========================================== */}
      {/* ПАНЕЛЬ ФИЛЬТРОВ И ПОИСКА */}
      {/* ========================================== */}
      <Paper withBorder p="md" radius="md" mb="xl" bg="white" shadow="sm">
        <Grid align="flex-end">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Поиск по журналу"
              placeholder="Имя, email или ID сущности..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              label="Тип действия"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: "ALL", label: "Все действия" },
                { value: "CREATE", label: "Только Создание" },
                { value: "UPDATE", label: "Только Обновление" },
                { value: "DELETE", label: "Только Удаление (Критичные)" },
              ]}
              value={actionFilter}
              onChange={setActionFilter}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              label="Раздел (Сущность)"
              leftSection={<IconHistory size={16} />}
              data={[
                { value: "ALL", label: "Все разделы" },
                ...uniqueEntities.map(e => ({ value: e, label: e }))
              ]}
              value={entityFilter}
              onChange={setEntityFilter}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ========================================== */}
      {/* ТАБЛИЦА ЛОГОВ */}
      {/* ========================================== */}
      <Paper withBorder radius="md" shadow="sm" p={0} style={{ overflow: "hidden", backgroundColor: "white" }}>
        {loading ? (
          <div style={{ padding: "20px" }}>
            <Skeleton height={40} mb="sm" />
            <Skeleton height={40} mb="sm" />
            <Skeleton height={40} />
          </div>
        ) : processedLogs.length > 0 ? (
          <Box style={{ overflowX: "auto" }}>
            <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="lg" style={{ minWidth: 900 }}>
              <Table.Thead style={{ backgroundColor: "#f8f9fa" }}>
                <Table.Tr>
                  <Table.Th style={{ color: "#1B2E3D" }}>Дата и Время</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D" }}>Сотрудник</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D" }}>Действие</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D" }}>Раздел (Сущность)</Table.Th>
                  <Table.Th style={{ color: "#1B2E3D" }}>Детали (Изменения)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {processedLogs.map((log) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="xs" fw={600} style={{ color: "#1B2E3D", whiteSpace: "nowrap" }}>
                        {formatDate(log.createdAt)}
                      </Text>
                    </Table.Td>
                    
                    <Table.Td>
                      <Text size="sm" fw={600} style={{ color: "#1B2E3D" }}>
                        {log.user?.name || "Неизвестно"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {log.user?.email || `ID: ${log.userId}`}
                      </Text>
                    </Table.Td>

                    <Table.Td>
                      {getActionBadge(log.action)}
                    </Table.Td>

                    <Table.Td>
                      <Badge color="dark" variant="outline">{log.entityType}</Badge>
                      <Text size="xs" c="dimmed" mt={2} style={{ fontFamily: "monospace" }}>
                        ID: {log.entityId?.slice(0,8)}...
                      </Text>
                    </Table.Td>

                    <Table.Td>
                      <Code block style={{ fontSize: "11px", backgroundColor: "#f8f9fa", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {JSON.stringify(log.details)}
                      </Code>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        ) : (
          <Center style={{ padding: "60px 20px", flexDirection: "column" }}>
            <IconHistory size={48} color="#e0e0e0" stroke={1.5} />
            <Text size="lg" fw={500} mt="md" style={{ color: "#1B2E3D" }}>Записей не найдено</Text>
            <Text c="dimmed" mt={5}>Журнал пуст или не совпадает с фильтрами.</Text>
          </Center>
        )}
      </Paper>
    </div>
  );
}