import { useState, useEffect, Fragment } from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  ThemeIcon,
  Center,
  Paper,
  Select,
  NumberInput,
  Button,
  Table,
  Badge,
  Divider,
  Group,
  Stack,
  Box,
  Accordion,
  TextInput,
  Textarea,
  ActionIcon,
  Loader,
  Affix,
  Transition,
  rem,
  Checkbox,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  IconPhoto,
  IconBulb,
  IconTypography,
  IconCube,
  IconTools,
  IconTags,
  IconArrowRight,
  IconCheck,
  IconArrowUp,
  IconPhone,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconClock,
  IconServerOff,
  IconPointFilled,
} from "@tabler/icons-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

import api from "../api/axios.js";

// ==========================================
// ИНТЕРАКТИВНЫЙ 3D-ЭЛЕМЕНТ
// ==========================================
const HeroIllustration = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-500, 500], [15, -15]);
  const rotateY = useTransform(x, [-500, 500], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      x.set(event.clientX - window.innerWidth / 2);
      y.set(event.clientY - window.innerHeight / 2);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y]);

  return (
    <Box
      style={{
        width: "100%",
        height: "clamp(300px, 80vw, 450px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: 1200,
        position: "relative",
      }}
    >
      <motion.div
        style={{
          width: "clamp(260px, 75vw, 360px)",
          height: "clamp(260px, 75vw, 360px)",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: "relative",
          zIndex: 1,
        }}
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <Paper
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#1B2E3D",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 30px 60px rgba(27, 46, 61, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateZ(0px)",
            overflow: "hidden"
          }}
        >
          <motion.img
            src="/assets/logo.svg"
            alt="Logo"
            style={{ width: "clamp(60px, 15vw, 100px)", height: "clamp(60px, 15vw, 100px)", transform: "translateZ(60px)", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))" }}
          />
          <Title
            order={3}
            mt="md"
            ta="center"
            style={{
              color: "white",
              letterSpacing: "3px",
              fontFamily: '"Alyamama", sans-serif',
              transform: "translateZ(40px)",
              lineHeight: 1.2,
              fontSize: "clamp(18px, 4vw, 24px)"
            }}
          >
            ROYAL<br/>BANNERS
          </Title>
        </Paper>

        <motion.div style={{ position: "absolute", top: -10, right: 10, transform: "translateZ(90px)" }} animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <ThemeIcon size={60} radius="100%" style={{ backgroundColor: "white", color: "#1B2E3D", border: "1px solid rgba(27,46,61,0.1)", boxShadow: "0 15px 30px rgba(27,46,61,0.08)" }}>
            <IconCube size={28} stroke={1.5} />
          </ThemeIcon>
        </motion.div>

        <motion.div style={{ position: "absolute", bottom: 20, left: -20, transform: "translateZ(110px)" }} animate={{ y: [0, -20, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
          <ThemeIcon size={70} radius="100%" style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", color: "#1B2E3D", border: "1px solid rgba(27,46,61,0.1)", boxShadow: "0 20px 40px rgba(27,46,61,0.1)" }}>
            <IconBulb size={32} stroke={1.5} />
          </ThemeIcon>
        </motion.div>
      </motion.div>
    </Box>
  );
};

// ==========================================
// УТИЛИТА CMS
// ==========================================
const parseCMSArray = (jsonString, fallbackArray) => {
  if (!jsonString) return fallbackArray;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : fallbackArray;
  } catch (e) {
    return fallbackArray;
  }
};

// ==========================================
// ГЛАВНЫЙ КОМПОНЕНТ HOME
// ==========================================
export default function Home() {
  const navigate = useNavigate();
  const [scroll, scrollTo] = useWindowScroll();

  // 1. ДАННЫЕ ВИТРИНЫ
  const categories = [
    { id: "banners", title: "Баннеры", icon: IconPhoto, desc: "Широкоформатная и интерьерная печать высокого разрешения" },
    { id: "lightboxes", title: "Лайтбоксы", icon: IconBulb, desc: "Световые короба любой сложности для привлечения внимания" },
    { id: "signboards", title: "Вывески", icon: IconTypography, desc: "Фасадные и интерьерные вывески из премиальных материалов" },
    { id: "3d-figures", title: "Объемные фигуры", icon: IconCube, desc: "3D конструкции, объемные буквы и нестандартные решения" },
    { id: "metal-frames", title: "Металлокаркасы", icon: IconTools, desc: "Сварка, покраска и надежный монтаж несущих конструкций" },
    { id: "pos-materials", title: "ПОС материалы", icon: IconTags, desc: "Рекламные стойки, промо-столы и оформление витрин" },
  ];

  // 2. СОСТОЯНИЯ
  const [priceList, setPriceList] = useState([]);
  const [calcConfigs, setCalcConfigs] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(true);

  const [activeConfigId, setActiveConfigId] = useState("");
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [fieldValues, setFieldValues] = useState({ val1: 1, val2: 1 });
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactService, setContactService] = useState("");
  const [contactComment, setContactComment] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // 3. ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingData(true);
        const pricesRes = await api.get("/prices");
        setPriceList(Array.isArray(pricesRes.data?.data) ? pricesRes.data.data : []);

        const configRes = await api.get("/settings/calculator");
        let loadedConfigs = configRes.data?.config || configRes.data?.data?.config || [];
        if (Array.isArray(loadedConfigs) && loadedConfigs.length > 0) {
          setCalcConfigs(loadedConfigs);
          setActiveConfigId(loadedConfigs[0].id);
          setIsDbConnected(true);
        } else {
          setIsDbConnected(false);
        }

        try {
          const blocksRes = await api.get("/pages/public?page=home");
          const blocks = blocksRes.data?.data || [];
          const blocksMap = {};
          blocks.forEach(b => { blocksMap[b.type] = b; });
          setPageData(blocksMap);
        } catch (cmsError) {
          console.warn("CMS данные недоступны", cmsError);
        }
      } catch (error) {
        setIsDbConnected(false);
      } finally {
        setLoadingData(false);
      }
    };
    fetchAllData();
  }, []);

  // 4. ЛОГИКА КАЛЬКУЛЯТОРА
  const activeConfig = calcConfigs.find((c) => c.id === activeConfigId);
  const availablePrices = priceList.filter(
    (p) => !activeConfig?.linkedPrices || activeConfig.linkedPrices.length === 0 || activeConfig.linkedPrices.includes(p.id) || activeConfig.linkedPrices.includes(p.service)
  );

  useEffect(() => {
    if (activeConfig) {
      if (availablePrices.length > 0) setSelectedPriceId(availablePrices[0].id || availablePrices[0].service);
      else setSelectedPriceId("");
      const newFields = {};
      activeConfig.fields.forEach((f) => { newFields[f.name] = 1; });
      setFieldValues(newFields);
      setSelectedAddons([]);
    }
  }, [activeConfigId, calcConfigs, priceList]);

  const handleFieldChange = (name, value) => setFieldValues((prev) => ({ ...prev, [name]: value }));
  const handleAddonChange = (addonId, isChecked) => {
    if (isChecked) setSelectedAddons((prev) => [...prev, addonId]);
    else setSelectedAddons((prev) => prev.filter((id) => id !== addonId));
  };

  const calculateEstimate = () => {
    if (!activeConfig) return 0;
    const selectedPriceItem = availablePrices.find((p) => p.id === selectedPriceId || p.service === selectedPriceId);
    const basePrice = selectedPriceItem ? selectedPriceItem.price : 0;
    let baseTotal = 0;
    const v1 = fieldValues["val1"] || 0;
    const v2 = fieldValues["val2"] || 0;

    if (activeConfig.calcType === "area" || activeConfig.calcType === "height_count") baseTotal = v1 * v2 * basePrice;
    else if (activeConfig.calcType === "length" || activeConfig.calcType === "unit") baseTotal = v1 * basePrice;
    else if (activeConfig.calcType === "custom") {
      try {
        let formulaStr = activeConfig.customFormula || "0";
        formulaStr = formulaStr.replace(/basePrice/g, basePrice);
        Object.keys(fieldValues).forEach((key) => { formulaStr = formulaStr.replace(new RegExp(key, "g"), fieldValues[key]); });
        baseTotal = new Function("return " + formulaStr)();
      } catch (e) { baseTotal = 0; }
    }
    let finalTotal = baseTotal;
    let percentAdds = 0;
    if (activeConfig.addons && activeConfig.addons.length > 0) {
      activeConfig.addons.forEach((addon) => {
        if (selectedAddons.includes(addon.id)) {
          if (addon.type === "fixed") finalTotal += Number(addon.value);
          else if (addon.type === "percent") percentAdds += Number(addon.value);
        }
      });
    }
    return Math.round(finalTotal + finalTotal * (percentAdds / 100));
  };

  const handleLeadSubmit = async () => {
    if (!leadPhone || leadPhone.trim() === "") return;
    setIsSubmittingLead(true);
    const estimate = calculateEstimate();
    const selectedPriceItem = availablePrices.find((p) => p.id === selectedPriceId || p.service === selectedPriceId);
    let details = `Раздел: ${activeConfig?.title}. Материал: ${selectedPriceItem?.service || "Не выбран"}.\n`;
    activeConfig?.fields.forEach((f) => { details += `${f.label}: ${fieldValues[f.name]}. `; });
    if (selectedAddons.length > 0) {
      details += `\nОпции: ${activeConfig.addons.filter((a) => selectedAddons.includes(a.id)).map((a) => a.name).join(", ")}.`;
    }
    try {
      await api.post("/orders", { clientName: "Лид (Смарт-Калькулятор)", clientPhone: leadPhone, description: `ЗАПРОС СМЕТЫ.\n${details}\nОжидаемая сумма: ~${estimate} ₸.`, price: estimate, status: "NEW" });
      setLeadSuccess(true);
    } catch (error) { setLeadSuccess(true); } finally { setIsSubmittingLead(false); }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactPhone || contactPhone.trim() === "") return;
    setIsSubmittingContact(true);
    try {
      await api.post("/orders", { clientName: contactName || "Без имени", clientPhone: contactPhone, description: `ОБЩАЯ ФОРМА. Интересует: ${contactService || "Не указано"}. Комментарий: ${contactComment || "Нет комментариев"}`, price: 0, status: "NEW" });
      setContactSuccess(true);
      setContactName(""); setContactPhone(""); setContactService(""); setContactComment("");
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) { setContactSuccess(true); setTimeout(() => setContactSuccess(false), 5000); } finally { setIsSubmittingContact(false); }
  };

  // 5. CMS ДАННЫЕ С НОВЫМИ ФОЛЛБЕКАМИ
  const statsList = parseCMSArray(pageData.Stats?.content, [
    { count: "100%", text: "Контроль качества" }, 
    { count: "0 ₸", text: "Выезд на замер" }, 
    { count: "12 мес", text: "Гарантия на работы" }, 
    { count: "24/7", text: "Прием заявок" }
  ]);
  
  const processList = parseCMSArray(pageData.WorkProcess?.content, [
    { step: "01", title: "Заявка и Замер", desc: "Выезжаем на объект для точного замера." }, 
    { step: "02", title: "Дизайн и Смета", desc: "Готовим 3D-макет и прозрачную смету." }, 
    { step: "03", title: "Производство", desc: "Изготавливаем заказ в нашем цеху." }, 
    { step: "04", title: "Монтаж", desc: "Профессионально монтируем конструкцию." }
  ]);
  
  const faqList = parseCMSArray(pageData.Faq?.content, [
    { q: "Сколько времени занимает изготовление вывески?", a: "Стандартные лайтбоксы и баннеры — от 1 до 3 рабочих дней. Сложные объемные буквы — от 5 до 10 дней." }, 
    { q: "Даете ли вы гарантию на работу?", a: "Да, мы предоставляем официальную гарантию от 1 года на все световые элементы и металлоконструкции." }, 
    { q: "Выезжаете ли вы на замер бесплатно?", a: "Да, выезд инженера-замерщика по городу Алматы осуществляется абсолютно бесплатно." }, 
    { q: "Делаете ли вы согласование с акиматом?", a: "Да, мы берем на себя все бюрократические вопросы по получению разрешительных документов." }
  ]);

  // АНИМАЦИОННЫЕ ВАРИАНТЫ
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div style={{ fontFamily: '"Google Sans", sans-serif', backgroundColor: "#FFFFFF", overflowX: "hidden", color: "#1B2E3D" }}>
      
      {/* КНОПКА НАВЕРХ */}
      <Affix position={{ bottom: rem(20), right: rem(20) }} zIndex={100}>
        <Transition transition="slide-up" mounted={scroll.y > 400}>
          {(transitionStyles) => (
            <ActionIcon style={{ ...transitionStyles, backgroundColor: "#1B2E3D", color: "white", border: "none", boxShadow: "0 8px 25px rgba(27, 46, 61, 0.15)" }} onClick={() => scrollTo({ y: 0 })} size="xl" radius="100%">
              <IconArrowUp size={24} stroke={2} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>

      {/* ========================================== */}
      {/* 1. HERO СЕКЦИЯ */}
      {/* ========================================== */}
      <Box pt={{ base: 20, md: 40 }} pb={{ base: 60, md: 100 }} style={{ backgroundColor: "#FFFFFF", position: "relative" }}>
        
        {/* НАВИГАЦИЯ (Общая для всех версий) */}
        <Container size="lg" style={{ position: "relative", zIndex: 20 }}>
          <Group justify="space-between" align="center" mb={{ base: 40, md: 80 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Group gap="sm" style={{ cursor: "pointer" }} onClick={() => scrollTo({ y: 0 })}>
                <ThemeIcon size={48} radius="100%" style={{ backgroundColor: "#1B2E3D" }}>
                  <img src="/assets/logo.svg" alt="Royal Banners" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                </ThemeIcon>
                <Title order={3} style={{ fontFamily: '"Alyamama", sans-serif', color: "#1B2E3D", letterSpacing: "1.5px", fontSize: "20px" }}>
                  ROYAL BANNERS
                </Title>
              </Group>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Group gap="lg">
                <Stack gap={0} align="flex-end" visibleFrom="sm">
                  <Text fw={800} size="lg" style={{ color: "#1B2E3D", lineHeight: 1 }}>+7 708 932 1854</Text>
                  <Group gap={5} mt={4}>
                    <IconPointFilled size={10} color="#1B2E3D" style={{ opacity: 0.6 }} />
                    <Text size="xs" fw={500} style={{ color: "rgba(27,46,61,0.6)", textTransform: "uppercase", letterSpacing: "1px" }}>На связи</Text>
                  </Group>
                </Stack>
                <Button component="a" href="https://wa.me/77089321854" target="_blank" size="md" radius="xl" style={{ backgroundColor: "transparent", color: "#1B2E3D", border: "1px solid rgba(27,46,61,0.15)", fontWeight: 600 }} leftSection={<IconBrandWhatsapp size={18} stroke={1.5} />} visibleFrom="xs">WhatsApp</Button>
                <ActionIcon size={48} radius="100%" variant="outline" style={{ borderColor: "rgba(27,46,61,0.15)", color: "#1B2E3D" }} component="a" href="https://wa.me/77089321854" target="_blank" hiddenFrom="xs"><IconBrandWhatsapp size={24} stroke={1.5} /></ActionIcon>
              </Group>
            </motion.div>
          </Group>
        </Container>

        <Container size="lg">
          
          {/* ========================================== */}
          {/* ДЕСКТОПНАЯ ВЕРСИЯ (РАЗДЕЛЕННЫЙ ЭКРАН 50/50) */}
          {/* ========================================== */}
          <Grid align="center" gutter={60} visibleFrom="md">
            <Grid.Col span={6}>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.div variants={fadeUp}>
                  <Group gap="xs" mb="xl" style={{ display: "inline-flex", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(27,46,61,0.1)" }}>
                    <Box style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#1B2E3D" }} />
                    <Text size="xs" fw={700} style={{ color: "#1B2E3D", letterSpacing: "1px", textTransform: "uppercase" }}>
                      Собственное производство в Алматы
                    </Text>
                  </Group>
                </motion.div>
                
                <motion.div variants={fadeUp}>
                  <Title order={1} style={{ color: "#1B2E3D", fontFamily: '"Google Sans", sans-serif', letterSpacing: "-0.5px", fontSize: "clamp(42px, 5vw, 64px)", lineHeight: 1.1, fontWeight: 900 }}>
                    РЕКЛАМА, КОТОРАЯ<br />ПРИНОСИТ ДЕНЬГИ
                  </Title>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Text size="lg" mt={24} maw={480} lh={1.6} style={{ color: "rgba(27,46,61,0.7)", fontWeight: 500 }}>
                    Изготавливаем вывески, лайтбоксы и металлоконструкции премиум-класса.
                  </Text>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Group mt={40} gap="sm">
                    <Button size="lg" radius="xl" style={{ backgroundColor: "#1B2E3D", color: "white", fontWeight: 500, padding: "0 28px" }} onClick={() => document.getElementById("contacts").scrollIntoView({ behavior: "smooth" })}>
                      Оставить заявку
                    </Button>
                    <Button size="lg" radius="xl" variant="default" style={{ color: "#1B2E3D", borderColor: "rgba(27,46,61,0.1)", backgroundColor: "transparent", fontWeight: 500, padding: "0 28px" }} onClick={() => navigate("/portfolio")}>
                      Смотреть работы
                    </Button>
                  </Group>
                </motion.div>
              </motion.div>
            </Grid.Col>

            <Grid.Col span={6}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                <HeroIllustration />
              </motion.div>
            </Grid.Col>
          </Grid>

          {/* ========================================== */}
          {/* МОБИЛЬНАЯ ВЕРСИЯ (НАЛОЖЕНИЕ СТЕКЛА НА 3D) */}
          {/* ========================================== */}
          <Box hiddenFrom="md" style={{ position: "relative", minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            
            {/* 3D-ЛОГОТИП НА ЗАДНЕМ ФОНЕ */}
            <Box style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1, width: "100%", pointerEvents: "none" }}>
              <HeroIllustration />
            </Box>

            {/* ТЕКСТ В СТЕКЛЯННОЙ КАПСУЛЕ ПОВЕРХ 3D */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ position: "relative", zIndex: 10, width: "100%", marginTop: "auto" }}>
              <Paper 
                p="xl" 
                radius="40px" 
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.85)", 
                  backdropFilter: "blur(12px)", 
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.6)", 
                  boxShadow: "0 20px 40px rgba(27, 46, 61, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <motion.div variants={fadeUp}>
                  <Group gap="xs" mb="lg" style={{ display: "inline-flex", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(27,46,61,0.15)", backgroundColor: "white" }}>
                    <Box style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#1B2E3D" }} />
                    <Text size="xs" fw={800} style={{ color: "#1B2E3D", letterSpacing: "1px", textTransform: "uppercase" }}>
                      Производство в Алматы
                    </Text>
                  </Group>
                </motion.div>
                
                <motion.div variants={fadeUp}>
                  <Title order={1} style={{ color: "#1B2E3D", fontFamily: '"Google Sans", sans-serif', letterSpacing: "-0.5px", fontSize: "clamp(32px, 8vw, 42px)", lineHeight: 1.1, fontWeight: 900 }}>
                    РЕКЛАМА, КОТОРАЯ<br />ПРИНОСИТ ДЕНЬГИ
                  </Title>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Text size="md" mt={20} lh={1.5} style={{ color: "rgba(27,46,61,0.8)", fontWeight: 500 }}>
                    Изготавливаем вывески, лайтбоксы и металлоконструкции премиум-класса.
                  </Text>
                </motion.div>

                <motion.div variants={fadeUp} style={{ width: "100%" }}>
                  <Stack mt={30} gap="sm">
                    <Button size="lg" radius="xl" fullWidth style={{ backgroundColor: "#1B2E3D", color: "white", fontWeight: 600, boxShadow: "0 10px 20px rgba(27, 46, 61, 0.15)" }} onClick={() => document.getElementById("contacts").scrollIntoView({ behavior: "smooth" })}>
                      Оставить заявку
                    </Button>
                    <Button size="lg" radius="xl" fullWidth variant="default" style={{ color: "#1B2E3D", borderColor: "rgba(27,46,61,0.2)", backgroundColor: "white", fontWeight: 600 }} onClick={() => navigate("/portfolio")}>
                      Смотреть работы
                    </Button>
                  </Stack>
                </motion.div>
              </Paper>
            </motion.div>
          </Box>

        </Container>
      </Box>

      {/* 2. КАТАЛОГ (СТРУКТУРНЫЕ КАРТОЧКИ) */}
      <Box id="catalog" py={{ base: 80, md: 100 }} style={{ backgroundColor: "#FFFFFF" }}>
        <Container size="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <Group justify="space-between" align="flex-end" mb={60}>
              <Box>
                <Text size="xs" fw={700} style={{ color: "rgba(27,46,61,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  {pageData.Catalog?.subtitle || "Каталог"}
                </Text>
                <Title order={2} style={{ color: "#1B2E3D", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800 }}>
                  {pageData.Catalog?.title || "Наши возможности"}
                </Title>
              </Box>
            </Group>
          </motion.div>

          <Grid gutter="lg">
            {categories.map((cat, idx) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={cat.id}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.1 } } }} style={{ height: '100%' }}>
                  <Card padding="xl" radius="40px" style={{ backgroundColor: "#F8F9FA", height: "100%", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)", border: "1px solid transparent" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "rgba(27,46,61,0.2)"; e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(27, 46, 61, 0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F8F9FA"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    onClick={() => navigate(`/category/${cat.id}`)}>
                    <ThemeIcon size={56} radius="100%" style={{ backgroundColor: "rgba(27,46,61,0.05)", color: "#1B2E3D" }} mb="lg">
                      <cat.icon size={24} stroke={1.5} />
                    </ThemeIcon>
                    <Title order={3} mb="xs" style={{ color: "#1B2E3D", fontSize: "18px", fontWeight: 700 }}>{cat.title}</Title>
                    <Text size="sm" lh={1.6} mb="xl" style={{ color: "rgba(27,46,61,0.6)" }}>{cat.desc}</Text>
                    <Group gap={6} mt="auto">
                      <Text size="xs" fw={700} style={{ color: "#1B2E3D", textTransform: "uppercase", letterSpacing: "1px" }}>Перейти</Text>
                      <IconArrowRight size={14} color="#1B2E3D" />
                    </Group>
                  </Card>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. БЛОК ФАКТОВ (ВЫРАЗИТЕЛЬНЫЕ ЦИФРЫ) */}
      <Box py={{ base: 60, md: 80 }} style={{ backgroundColor: "#1B2E3D" }}>
        <Container size="lg">
          <Grid align="center" justify="center" gutter={{ base: 40, md: 0 }}>
            {statsList.map((stat, idx) => (
              <Grid.Col span={{ base: 6, sm: 3 }} key={idx}>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                  <Stack gap={0} align="center">
                    <Title order={1} style={{ fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.2 }}>
                      {stat.count}
                    </Title>
                    <Text size="xs" fw={500} style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", marginTop: "4px" }}>
                      {stat.text}
                    </Text>
                  </Stack>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. КАК МЫ РАБОТАЕМ (ОГРОМНЫЕ ЦИФРЫ НА ФОНЕ) */}
      <Box py={{ base: 80, md: 100 }} style={{ backgroundColor: "#FFFFFF" }}>
        <Container size="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Center mb={{ base: 50, md: 60 }} style={{ flexDirection: "column" }}>
              <Text size="xs" fw={700} style={{ color: "rgba(27,46,61,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                {pageData.WorkProcess?.subtitle || "Прозрачный процесс от заявки до монтажа"}
              </Text>
              <Title order={2} style={{ color: "#1B2E3D", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800 }}>
                {pageData.WorkProcess?.title || "Как мы работаем"}
              </Title>
            </Center>
          </motion.div>

          <Grid gutter={30}>
            {processList.map((item, idx) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={idx}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} style={{ height: "100%" }}>
                  <Paper p="xl" radius="40px" style={{ backgroundColor: "#F8F9FA", position: "relative", overflow: "hidden", border: "1px solid transparent", height: "100%", transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "rgba(27,46,61,0.2)"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(27,46,61,0.05)"; }}>
                    <Text style={{ position: "absolute", top: "-15px", right: "5px", fontSize: "120px", fontWeight: 900, color: "rgba(27, 46, 61, 0.04)", fontFamily: '"Alyamama", sans-serif', lineHeight: 1, userSelect: "none" }}>{item.step}</Text>
                    <ThemeIcon size={48} radius="100%" style={{ backgroundColor: "#1B2E3D", color: "white", position: "relative", zIndex: 2 }} mb="lg"><Text fw={700}>{item.step}</Text></ThemeIcon>
                    <Title order={4} mb="xs" style={{ color: "#1B2E3D", position: "relative", zIndex: 2, fontSize: "18px", fontWeight: 700 }}>{item.title}</Title>
                    <Text size="sm" lh={1.6} style={{ color: "rgba(27,46,61,0.6)", position: "relative", zIndex: 2 }}>{item.desc}</Text>
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. СМАРТ-КАЛЬКУЛЯТОР И ПРАЙС */}
      <Box py={{ base: 80, md: 100 }} style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(27,46,61,0.05)", borderBottom: "1px solid rgba(27,46,61,0.05)" }}>
        <Container size="lg">
          <Grid gutter={60}>
            {/* КАЛЬКУЛЯТОР */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Text size="xs" fw={700} style={{ color: "rgba(27,46,61,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Онлайн расчет</Text>
                <Title order={2} mb="md" style={{ color: "#1B2E3D", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800 }}>
                  {pageData.Calculator?.title || "Умная смета"}
                </Title>
                <Text mb="xl" size="sm" lh={1.6} style={{ color: "rgba(27,46,61,0.6)" }}>
                  {pageData.Calculator?.subtitle || "Укажите параметры для мгновенного расчета стоимости."}
                </Text>

                <Paper p={{ base: "xl", md: 30 }} radius="40px" style={{ backgroundColor: "#1B2E3D", position: "relative" }}>
                  {!leadSuccess ? (
                    <Stack gap="lg">
                      {loadingData ? ( <Center p="xl"><Loader color="white" size="sm" /></Center> ) : calcConfigs.length > 0 ? (
                        <>
                          <Select label={<Text fw={600} size="sm" style={{ color: "white", marginBottom: 4 }}>Тип конструкции</Text>} value={activeConfigId} onChange={setActiveConfigId} data={calcConfigs.map((c) => ({ value: c.id, label: c.title }))} size="md" radius="xl" 
                            styles={{ input: { backgroundColor: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)" }, dropdown: { backgroundColor: "white", color: "#1B2E3D", border: "none", borderRadius: "24px" } }} />
                          
                          {availablePrices.length > 0 && (
                            <Select label={<Text fw={600} size="sm" style={{ color: "white", marginBottom: 4 }}>Материал</Text>} value={selectedPriceId} onChange={setSelectedPriceId} data={availablePrices.map((p) => ({ value: p.id || p.service, label: `${p.service} (${p.price} ₸/${p.unit})` }))} size="md" radius="xl" 
                              styles={{ input: { backgroundColor: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)" }, dropdown: { backgroundColor: "white", color: "#1B2E3D", border: "none", borderRadius: "24px" } }} />
                          )}
                          
                          {activeConfig?.fields.length > 0 && (
                            <Group grow>
                              {activeConfig.fields.map((f, idx) => (
                                <NumberInput key={idx} label={<Text fw={600} size="sm" style={{ color: "white", marginBottom: 4 }}>{f.label}</Text>} min={0} size="md" radius="xl" value={fieldValues[f.name] || 0} onChange={(val) => handleFieldChange(f.name, val)} 
                                  styles={{ input: { backgroundColor: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" } }} />
                              ))}
                            </Group>
                          )}

                          {activeConfig?.addons?.length > 0 && (
                            <Box mt="xs">
                              <Text size="xs" fw={700} mb="sm" style={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Дополнительно:</Text>
                              <Stack gap="xs">
                                {activeConfig.addons.map((addon) => (
                                  <Checkbox key={addon.id} label={<Text size="sm" style={{ color: "white" }}>{addon.name}</Text>} color="gray" size="sm" radius="100%" checked={selectedAddons.includes(addon.id)} onChange={(event) => handleAddonChange(addon.id, event.currentTarget.checked)} />
                                ))}
                              </Stack>
                            </Box>
                          )}
                          
                          <Divider color="rgba(255,255,255,0.1)" my="xs" />
                          
                          <Group justify="space-between" align="flex-end">
                            <Box>
                              <Text size="xs" tt="uppercase" fw={600} style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Итоговая оценка</Text>
                              <Text fw={800} style={{ color: "white", fontSize: "28px", lineHeight: 1 }}>~{calculateEstimate().toLocaleString("ru-RU")} ₸</Text>
                            </Box>
                          </Group>

                          <Paper p="lg" radius="40px" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }} mt="sm">
                            <Text size="xs" fw={500} style={{ color: "rgba(255,255,255,0.7)" }} mb="sm">Оставьте номер для связи:</Text>
                            <TextInput placeholder="+7 (___) ___-__-__" size="md" radius="xl" value={leadPhone} onChange={(e) => setLeadPhone(e.currentTarget.value)} required leftSection={<IconPhone size={16} color="#1B2E3D" />} 
                              styles={{ input: { backgroundColor: "white", color: "#1B2E3D", border: "none", fontWeight: 600 } }} mb="md" />
                            <Button fullWidth size="md" radius="xl" loading={isSubmittingLead} onClick={handleLeadSubmit} disabled={!leadPhone || leadPhone.trim() === ""} style={{ backgroundColor: "white", color: "#1B2E3D", fontWeight: 600 }}>
                              Отправить запрос
                            </Button>
                          </Paper>
                        </>
                      ) : !isDbConnected ? (
                        <Center p="xl" style={{ flexDirection: "column", textAlign: "center" }}><IconServerOff size={32} color="rgba(255,255,255,0.3)" /><Text style={{ color: "white" }} fw={500} mt="md" size="sm">Сервис недоступен</Text></Center>
                      ) : ( <Text size="sm" style={{ color: "rgba(255,255,255,0.5)" }} ta="center">Загрузка...</Text> )}
                    </Stack>
                  ) : (
                    <Center p="xl" style={{ flexDirection: "column", textAlign: "center", minHeight: "350px" }}>
                      <ThemeIcon size={60} radius="100%" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white" }} mb="lg"><IconCheck size={28} /></ThemeIcon>
                      <Title order={3} style={{ color: "white", fontSize: "20px", fontWeight: 600 }}>Заявка принята</Title>
                      <Text size="sm" mt="sm" lh={1.6} style={{ color: "rgba(255,255,255,0.6)" }}>Мы свяжемся с вами в течение 10 минут.</Text>
                      <Button mt="xl" size="sm" radius="xl" variant="outline" style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }} onClick={() => setLeadSuccess(false)}>Новый расчет</Button>
                    </Center>
                  )}
                </Paper>
              </motion.div>
            </Grid.Col>

            {/* ПРАЙС-ЛИСТ */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Text size="xs" fw={700} style={{ color: "transparent", marginBottom: "8px" }}>Отступ</Text>
                <Title order={3} mb="xl" style={{ color: "#1B2E3D", fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 800 }}>Базовые расценки</Title>
                <Paper radius="40px" p={0} style={{ backgroundColor: "white", overflow: "hidden", border: "1px solid rgba(27,46,61,0.1)" }}>
                  <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                    <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                      <Table.Thead style={{ position: "sticky", top: 0, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", zIndex: 1, borderBottom: "1px solid rgba(27,46,61,0.05)" }}>
                        <Table.Tr>
                          <Table.Th style={{ color: "rgba(27,46,61,0.5)", fontWeight: 600, fontSize: "12px" }}>УСЛУГА</Table.Th>
                          <Table.Th style={{ color: "rgba(27,46,61,0.5)", fontWeight: 600, fontSize: "12px" }}>ЕД. ИЗМ.</Table.Th>
                          <Table.Th style={{ color: "rgba(27,46,61,0.5)", fontWeight: 600, fontSize: "12px", textAlign: "right" }}>ЦЕНА</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {loadingData ? ( <Table.Tr><Table.Td colSpan={3}><Center p="xl"><Loader size="sm" color="#1B2E3D" /></Center></Table.Td></Table.Tr> ) : priceList.length > 0 ? (
                          priceList.map((item, idx) => (
                            <Table.Tr key={idx}>
                              <Table.Td><Text fw={600} size="sm" style={{ color: "#1B2E3D" }}>{item.service}</Text></Table.Td>
                              <Table.Td><Badge variant="outline" radius="xl" style={{ color: "rgba(27,46,61,0.6)", borderColor: "rgba(27,46,61,0.2)", fontWeight: 500 }}>{item.unit}</Badge></Table.Td>
                              <Table.Td style={{ textAlign: "right" }}><Text fw={700} size="sm" style={{ color: "#1B2E3D" }}>{item.price.toLocaleString("ru-RU")} ₸</Text></Table.Td>
                            </Table.Tr>
                          ))
                        ) : ( <Table.Tr><Table.Td colSpan={3} align="center"><Text c="dimmed" size="sm" py="xl">Прайс-лист пуст</Text></Table.Td></Table.Tr> )}
                      </Table.Tbody>
                    </Table>
                  </div>
                </Paper>
              </motion.div>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 6. ЧАСТЫЕ ВОПРОСЫ (ПОЛНОСТЬЮ КРУГЛЫЕ АККОРДЕОНЫ) */}
      <Box style={{ backgroundColor: "#FFFFFF" }} py={{ base: 80, md: 100 }}>
        <Container size="md">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Center mb={{ base: 40, md: 60 }}><Title order={2} style={{ color: "#1B2E3D", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800 }}>{pageData.Faq?.title || "Частые вопросы"}</Title></Center>
            <Accordion variant="separated" radius="40px" chevronSize={20} styles={{ item: { border: "1px solid rgba(27,46,61,0.1)", backgroundColor: "white", marginBottom: "16px", transition: "all 0.2s ease", '&[data-active]': { borderColor: "#1B2E3D" } }, control: { fontWeight: 600, color: "#1B2E3D", padding: "20px", fontSize: "16px" }, content: { padding: "0 20px 24px 20px", color: "rgba(27,46,61,0.6)", fontSize: "14px", lineHeight: 1.6 } }}>
              {faqList.map((faq, idx) => (
                <Accordion.Item value={`faq-${idx}`} key={idx}>
                  <Accordion.Control>{faq.q}</Accordion.Control>
                  <Accordion.Panel>{faq.a}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </motion.div>
        </Container>
      </Box>

      {/* 7. КОНТАКТЫ И ФОРМА */}
      <Box style={{ backgroundColor: "#1B2E3D" }} py={{ base: 80, md: 100 }} id="contacts">
        <Container size="lg">
          <Grid gutter={{ base: 60, md: 80 }} align="center">
            {/* ЛЕВАЯ ЧАСТЬ - КОНТАКТЫ */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Text size="xs" fw={600} style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{pageData.Contacts?.subtitle || "КОНТАКТЫ"}</Text>
                <Title order={2} style={{ color: "white", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, lineHeight: 1.1 }} mb="xl">
                  {pageData.Contacts?.title || "Обсудим проект?"}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.6)" }} mb={40} lh={1.6} size="sm">
                  {pageData.Contacts?.content || "Оставьте заявку, и мы свяжемся с вами для консультации."}
                </Text>

                <Stack gap="lg">
                  <Group wrap="nowrap">
                    <ThemeIcon size={56} radius="100%" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <IconPhone size={24} stroke={1.5} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" fw={500} style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>Телефон</Text>
                      <Text size="lg" fw={700} style={{ color: "white" }}>+7 708 932 1854</Text>
                    </div>
                  </Group>

                  <Group wrap="nowrap">
                    <ThemeIcon size={56} radius="100%" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <IconBrandInstagram size={24} stroke={1.5} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" fw={500} style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>Instagram</Text>
                      <Text size="lg" fw={700} style={{ color: "white", textDecoration: "none" }} component="a" href="https://instagram.com/royal.banners.almaty" target="_blank">@royal.banners.almaty</Text>
                    </div>
                  </Group>
                </Stack>
              </motion.div>
            </Grid.Col>

            {/* ПРАВАЯ ЧАСТЬ - ФОРМА (УЛЬТРА-ОКРУГЛАЯ) */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Paper p={{ base: "xl", md: 40 }} radius="40px" style={{ backgroundColor: "white", border: "1px solid rgba(27,46,61,0.1)" }}>
                  {!contactSuccess ? (
                    <form onSubmit={handleContactSubmit}>
                      <Title order={3} mb="xl" style={{ color: "#1B2E3D", fontSize: "24px", fontWeight: 800 }}>Оставить заявку</Title>
                      <Stack gap="lg">
                        <TextInput placeholder="Ваше имя" size="md" radius="xl" maxLength={50} value={contactName} onChange={(e) => setContactName(e.currentTarget.value)} styles={{ input: { backgroundColor: "transparent", border: "1px solid rgba(27,46,61,0.2)" } }} />
                        <TextInput type="tel" placeholder="Номер телефона *" size="md" radius="xl" required maxLength={20} value={contactPhone} onChange={(e) => setContactPhone(e.currentTarget.value)} styles={{ input: { backgroundColor: "transparent", border: "1px solid rgba(27,46,61,0.2)" } }} />
                        <Select placeholder="Выберите услугу" data={["Объемные буквы", "Лайтбокс", "Баннер", "Монтаж", "Другое"]} size="md" radius="xl" value={contactService} onChange={setContactService} styles={{ input: { backgroundColor: "transparent", border: "1px solid rgba(27,46,61,0.2)" }, dropdown: { borderRadius: "24px" } }} />
                        <Textarea placeholder="Комментарий (необязательно)" minRows={3} radius="24px" maxLength={500} size="md" value={contactComment} onChange={(e) => setContactComment(e.currentTarget.value)} styles={{ input: { backgroundColor: "transparent", border: "1px solid rgba(27,46,61,0.2)", borderRadius: "24px" } }} />
                        <Button type="submit" size="md" radius="xl" fullWidth mt="sm" loading={isSubmittingContact} disabled={!contactPhone || contactPhone.trim() === ""} style={{ backgroundColor: "#1B2E3D", color: "white", fontWeight: 600 }}>
                          Отправить
                        </Button>
                        <Text size="xs" style={{ color: "rgba(27,46,61,0.4)" }} ta="center" mt="xs">Нажимая кнопку, вы соглашаетесь с обработкой данных.</Text>
                      </Stack>
                    </form>
                  ) : (
                    <Center style={{ flexDirection: "column", textAlign: "center", minHeight: "450px" }}>
                      <ThemeIcon size={80} radius="100%" style={{ backgroundColor: "rgba(27,46,61,0.05)", color: "#1B2E3D" }} mb="xl"><IconCheck size={40} /></ThemeIcon>
                      <Title order={2} style={{ color: "#1B2E3D", fontSize: "24px", fontWeight: 800 }}>Спасибо!</Title>
                      <Text size="sm" mt="sm" lh={1.6} style={{ color: "rgba(27,46,61,0.6)" }}>Мы свяжемся с вами в ближайшее время.</Text>
                    </Center>
                  )}
                </Paper>
              </motion.div>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 8. FOOTER */}
      <Box style={{ backgroundColor: "#1B2E3D", borderTop: "1px solid rgba(255,255,255,0.05)" }} py={40}>
        <Container size="lg">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <img src="/assets/logo.svg" alt="Logo" style={{ width: "24px", height: "24px", filter: "brightness(0) invert(1)", opacity: 0.6 }} />
              <Title order={4} style={{ fontFamily: '"Alyamama", sans-serif', color: "rgba(255,255,255,0.6)", letterSpacing: "2px", fontSize: "16px" }}>ROYAL BANNERS</Title>
            </Group>
            <Text size="xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 ERP System</Text>
            <Group gap="sm">
              <ActionIcon variant="transparent" size="lg" radius="100%" component="a" href="https://wa.me/77089321854" target="_blank" style={{ color: "rgba(255,255,255,0.5)" }}>
                <IconBrandWhatsapp size={20} />
              </ActionIcon>
              <ActionIcon variant="transparent" size="lg" radius="100%" component="a" href="https://instagram.com/royal.banners.almaty" target="_blank" style={{ color: "rgba(255,255,255,0.5)" }}>
                <IconBrandInstagram size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>
    </div>
  );
}