import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  Title,
  NavLink,
  Button,
  Text,
  Center,
  Image,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconPhoto,
  IconShoppingCart,
  IconUsers,
  IconLogout,
  IconReportMoney,
  IconWallet,
  IconSettings,
  IconFolder,
  IconHistory,
  IconAppWindow,
} from "@tabler/icons-react";

// ==========================================
// ИМПОРТЫ НАШИХ БОЕВЫХ СТРАНИЦ
// ==========================================
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Users from "./pages/Users.jsx";
import Category from "./pages/Category.jsx";
import Prices from "./pages/Prices.jsx";
import Finance from "./pages/Finance.jsx";
import CalculatorSettings from "./pages/CalculatorSettings.jsx";
import PublicPortfolio from "./pages/PublicPortfolio.jsx";
import PageBuilder from "./pages/PageBuilder.jsx";
import MediaLibrary from "./pages/Media.jsx";
import AuditLogs from "./pages/Audit.jsx";

// ==========================================
// СЕНЬОРСКАЯ АРХИТЕКТУРА: ИЗОЛИРОВАННАЯ АДМИНКА
// Загружается ТОЛЬКО на домене rukb.yeee.kz
// ==========================================
const AdminLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Очищаем сессию
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Выкидываем на страницу логина
    window.location.href = "/login";
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* ========================================== */}
      {/* ШАПКА АДМИНКИ */}
      {/* ========================================== */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group
              gap="sm"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <Center
                bg="#1B2E3D"
                w={40}
                h={40}
                style={{ borderRadius: "8px" }}
              >
                <Image src="/assets/logo.svg" w={24} h={24} fit="contain" />
              </Center>
              <Title
                order={3}
                visibleFrom="sm"
                style={{
                  fontFamily: '"Alyamama", sans-serif',
                  color: "#1B2E3D",
                  letterSpacing: "1px",
                  fontWeight: 700,
                }}
              >
                ROYAL BANNERS
              </Title>
            </Group>
          </Group>

          <Button
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            style={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 600 }}
          >
            Выйти
          </Button>
        </Group>
      </AppShell.Header>

      {/* ========================================== */}
      {/* БОКОВОЕ МЕНЮ АДМИНКИ (СО СКОРЛЛОМ) */}
      {/* ========================================== */}
      <AppShell.Navbar
        p="md"
        style={{ fontFamily: '"Google Sans", sans-serif' }}
      >
        <AppShell.Section grow component={ScrollArea}>
          <Text c="dimmed" size="xs" fw={700} mb="sm" mt="md" tt="uppercase">
            Бизнес
          </Text>
          <NavLink
            label="Дашборд"
            leftSection={<IconDashboard size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/"}
          />
          <NavLink
            label="Заказы"
            leftSection={<IconShoppingCart size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/orders");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/orders"}
          />
          <NavLink
            label="Финансы"
            leftSection={<IconWallet size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/finance");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/finance"}
          />
          <NavLink
            label="Прайс-лист"
            leftSection={<IconReportMoney size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/prices");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/prices"}
          />

          <Text c="dimmed" size="xs" fw={700} mb="sm" mt="xl" tt="uppercase">
            Контент (CMS)
          </Text>
          <NavLink
            label="Конструктор страниц"
            leftSection={<IconAppWindow size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/cms");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/cms"}
          />
          <NavLink
            label="Портфолио"
            leftSection={<IconPhoto size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/portfolio");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/portfolio"}
          />
          <NavLink
            label="Медиабиблиотека"
            leftSection={<IconFolder size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/media");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/media"}
          />

          <Text c="dimmed" size="xs" fw={700} mb="sm" mt="xl" tt="uppercase">
            Система
          </Text>
          <NavLink
            label="Калькулятор"
            leftSection={<IconSettings size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/calculator-settings");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/calculator-settings"}
          />
          <NavLink
            label="Сотрудники"
            leftSection={<IconUsers size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/users");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/users"}
          />
          <NavLink
            label="Журнал аудита"
            leftSection={<IconHistory size="1.1rem" stroke={1.5} />}
            onClick={() => {
              navigate("/audit");
              toggle();
            }}
            color="royalBlue"
            variant="light"
            active={location.pathname === "/audit"}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      {/* ========================================== */}
      {/* РЕНДЕР КОНТЕНТА АДМИНКИ */}
      {/* ========================================== */}
      <AppShell.Main bg="#f8f9fa">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/calculator-settings" element={<CalculatorSettings />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/users" element={<Users />} />
          <Route path="/cms" element={<PageBuilder />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/audit" element={<AuditLogs />} />

          {/* Если ввели несуществующий путь в админке — на дашборд */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

// ==========================================
// ГЛАВНЫЙ РОУТЕР ПРИЛОЖЕНИЯ
// ==========================================
export default function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // 🔥 SENIOR DOMAIN ROUTING
  const currentHost = window.location.hostname;
  
  // Проверяем домен. Если rukb.yeee.kz (или localhost для разработки) - отдаем админку
  const isAdminDomain = currentHost === "rukb.yeee.kz" || currentHost === "localhost" || currentHost.startsWith("192.168.");

  // =======================================
  // СЦЕНАРИЙ 1: АДМИНКА (rukb.yeee.kz)
  // =======================================
  if (!isAdminDomain) {
    return (
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    );
  }

  // =======================================
  // СЦЕНАРИЙ 2: ВИТРИНА (ukb.yeee.kz)
  // =======================================
  return (
    <Routes>
      {/* ПУБЛИЧНАЯ ЗОНА (Доступна всем клиентам) */}
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/portfolio" element={<PublicPortfolio />} />

      {/* Защита: если на клиенте попытаются открыть несуществующую страницу - кидаем на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}