import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCalendarCheck,
  IconFlame,
  IconInfoCircle,
  IconPlus,
  IconSparkles,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/cs';
import Header from './components/Header';
import SupplementItem from './components/SupplementItem';
import ReminderCard from './components/ReminderCard';
import AddSupplementForm, {
  SupplementDraft,
} from './components/AddSupplementForm';
import {
  getFriendlyDate,
  getPastDates,
  getTodayDateString,
} from './utils/dateUtils';
import type { Supplement } from './types';

dayjs.locale('cs');

const SUPPLEMENTS_KEY = 'supplementTrackerData';
const SETTINGS_KEY = 'supplementTrackerSettings';

interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:MM
}

const DEFAULT_REMINDER: ReminderSettings = {
  enabled: true,
  time: '19:00',
};

const INITIAL_SUPPLEMENTS: Supplement[] = [
  {
    id: 'sup_vitamins',
    name: 'Ranní multivitamín',
    dosage: '2 kapsle po snídani',
    category: 'vitamin',
    reminderHour: 8,
    lastTakenDate: null,
    history: [],
  },
  {
    id: 'sup_creatine',
    name: 'Kreatin monohydrát',
    dosage: '5 g ve vodě po tréninku',
    category: 'creatine',
    reminderHour: 17,
    lastTakenDate: null,
    history: [],
  },
];

const normalizeSupplement = (raw: any): Supplement => {
  const history = Array.isArray(raw?.history)
    ? raw.history.filter((value: unknown): value is string => {
        return typeof value === 'string';
      })
    : [];
  const lastTaken =
    typeof raw?.lastTakenDate === 'string' ? raw.lastTakenDate : null;
  if (lastTaken && !history.includes(lastTaken)) {
    history.push(lastTaken);
  }

  return {
    id:
      typeof raw?.id === 'string'
        ? raw.id
        : `sup_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: typeof raw?.name === 'string' ? raw.name : 'Neznámý doplněk',
    dosage:
      typeof raw?.dosage === 'string' && raw.dosage.trim().length > 0
        ? raw.dosage
        : '1 dávka',
    category: raw?.category ?? 'other',
    reminderHour:
      typeof raw?.reminderHour === 'number' ? raw.reminderHour : 18,
    lastTakenDate: lastTaken,
    history,
  };
};

const parseReminderTime = (
  time: string
): { hour: number; minute: number } | null => {
  const [hourString, minuteString] = time.split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);
  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }
  return { hour, minute };
};

const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const containerSize = isMobile ? 440 : 'lg';
  const containerPaddingX = isMobile ? 'md' : 'xl';
  const sectionGap = isMobile ? 'lg' : 'xl';
  const cardPadding = isMobile ? 'md' : 'lg';
  const cardRadius = isMobile ? 'lg' : 'xl';

  const [supplements, setSupplements] =
    useState<Supplement[]>(INITIAL_SUPPLEMENTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderSettings, setReminderSettings] =
    useState<ReminderSettings>(DEFAULT_REMINDER);

  // Hydrate supplements
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(SUPPLEMENTS_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const normalized = parsed.map((item: any) => normalizeSupplement(item));
        setSupplements(normalized);
      }
    } catch (error) {
      console.error('Failed to parse stored supplements', error);
      setSupplements(INITIAL_SUPPLEMENTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Hydrate reminder settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReminderSettings;
        if (parsed.time) {
          setReminderSettings({
            enabled:
              typeof parsed.enabled === 'boolean'
                ? parsed.enabled
                : DEFAULT_REMINDER.enabled,
            time: parsed.time ?? DEFAULT_REMINDER.time,
          });
        }
      }
    } catch (error) {
      console.error('Failed to parse reminder settings', error);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  // Persist supplements
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    localStorage.setItem(SUPPLEMENTS_KEY, JSON.stringify(supplements));
  }, [supplements, isLoaded]);

  // Persist reminder settings
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(reminderSettings));
  }, [reminderSettings, settingsLoaded]);

  // Schedule notifications
  useEffect(() => {
    if (!isLoaded || !settingsLoaded || !reminderSettings.enabled) {
      return;
    }
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const parsed = parseReminderTime(reminderSettings.time);
    if (!parsed) {
      return;
    }

    const now = new Date();
    const reminderDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parsed.hour,
      parsed.minute,
      0
    );

    if (reminderDate <= now) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(SUPPLEMENTS_KEY);
        if (!stored) {
          return;
        }
        const parsedSupplements: Supplement[] = JSON.parse(stored);
        const today = getTodayDateString();
        const allTaken =
          parsedSupplements.length > 0 &&
          parsedSupplements.every(
            (sup: Supplement) => sup.lastTakenDate === today
          );
        if (!allTaken) {
          new Notification('Připomínka suplementů', {
            body: 'Je čas dořešit dnešní vitamíny a kreatin 💊',
            icon: '/vite.svg',
            tag: 'supplement-reminder',
          });
        }
      } catch (error) {
        console.error('Unable to trigger reminder notification', error);
      }
    }, reminderDate.getTime() - now.getTime());

    return () => window.clearTimeout(timeoutId);
  }, [reminderSettings, supplements, isLoaded, settingsLoaded]);

  const today = getTodayDateString();
  const totalSupplements = supplements.length;
  const completedToday = supplements.filter(
    (sup) => sup.lastTakenDate === today
  ).length;
  const completionRate =
    totalSupplements === 0
      ? 0
      : Math.round((completedToday / totalSupplements) * 100);
  const supplementsLeft = Math.max(totalSupplements - completedToday, 0);

  const weeklyHistory = useMemo(() => {
    const dates = getPastDates(7).reverse();
    return dates.map((date) => ({
      date,
      label: dayjs(date).format('dd'),
      completed:
        supplements.length > 0 &&
        supplements.every((sup) => sup.history.includes(date)),
    }));
  }, [supplements]);

  const weeklyScore = weeklyHistory.filter((item) => item.completed).length;

  const streak = useMemo(() => {
    const dates = getPastDates(14);
    let counter = 0;
    for (const date of dates) {
      const allTaken =
        supplements.length > 0 &&
        supplements.every((sup) => sup.history.includes(date));
      if (allTaken) {
        counter += 1;
      } else {
        break;
      }
    }
    return counter;
  }, [supplements]);

  const insightMessage =
    completionRate === 100
      ? 'Legendární disciplína! Zapiš si klidně ještě strečink nebo procházku.'
      : completionRate >= 50
        ? 'Jsi za půlkou. Odfoukni si krátkou pauzu a dokonči zbytek.'
        : 'Začni malou akcí – třeba jen připravit shaker. Momentum přijde samo.';

  const notificationBlocked =
    typeof window !== 'undefined' &&
    reminderSettings.enabled &&
    'Notification' in window &&
    Notification.permission === 'denied';

  const handleTakeSupplement = (id: string) => {
    const source = supplements.find((sup) => sup.id === id);
    setSupplements((prev) =>
      prev.map((sup) => {
        if (sup.id !== id) {
          return sup;
        }
        const alreadyLogged = sup.history.includes(today);
        return {
          ...sup,
          lastTakenDate: today,
          history: alreadyLogged ? sup.history : [...sup.history, today],
        };
      })
    );

    if (source) {
      notifications.show({
        title: 'Hotovo!',
        message: `${source.name} zapsaný pro dnešek.`,
        color: 'teal',
      });
    }
  };

  const handleAddSupplement = (draft: SupplementDraft) => {
    const newSupplement: Supplement = {
      id: `sup_${Date.now()}`,
      name: draft.name,
      dosage: draft.dosage,
      category: draft.category,
      reminderHour: draft.reminderHour,
      lastTakenDate: null,
      history: [],
    };
    setSupplements((prev) => [...prev, newSupplement]);
    notifications.show({
      title: 'Přidáno',
      message: `${draft.name} přidán do plánu.`,
      color: 'indigo',
    });
  };

  const handleUpdateSupplement = (id: string, data: Partial<Supplement>) => {
    setSupplements((prev) =>
      prev.map((sup) => (sup.id === id ? { ...sup, ...data } : sup))
    );
  };

  const handleDeleteSupplement = (id: string) => {
    const removed = supplements.find((sup) => sup.id === id);
    setSupplements((prev) => prev.filter((sup) => sup.id !== id));
    if (removed) {
      notifications.show({
        title: 'Odstraněno',
        message: `${removed.name} byl odebrán.`,
        color: 'red',
      });
    }
  };

  const handleReminderToggle = (value: boolean) => {
    if (
      value &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission();
    }
    setReminderSettings((prev) => ({ ...prev, enabled: value }));
  };

  const handleReminderTimeChange = (value: string) => {
    const parsed = parseReminderTime(value);
    if (!parsed) {
      return;
    }
    const normalized = `${parsed.hour.toString().padStart(2, '0')}:${parsed.minute
      .toString()
      .padStart(2, '0')}`;
    setReminderSettings((prev) => ({ ...prev, time: normalized }));
  };

  return (
    <Container
      size={containerSize}
      px={containerPaddingX}
      py="xl"
      style={{
        minHeight: '100vh',
        paddingTop: isMobile ? '1.5rem' : '2.5rem',
        paddingBottom: isMobile ? '3rem' : '4rem',
      }}
    >
      <Stack gap={sectionGap}>
        <Header
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing((prev) => !prev)}
          completionRate={completionRate}
          todayLabel={getFriendlyDate()}
          supplementsLeft={supplementsLeft}
          isCompact={isMobile}
        />

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={isMobile ? 'md' : 'xl'}>
          <Card withBorder radius={cardRadius} padding={cardPadding}>
            <Group gap="xs">
              <IconFlame size={24} />
              <Text fw={700}>Streak</Text>
            </Group>
            <Title order={2}>{streak} dní</Title>
            <Text size="sm" c="dimmed">
              {streak > 0
                ? 'Nepřerušuj tempo, tělo si zvyklo.'
                : 'Začni nový streak dnes.'}
            </Text>
          </Card>
          <Card withBorder radius={cardRadius} padding={cardPadding}>
            <Group gap="xs">
              <IconCalendarCheck size={24} />
              <Text fw={700}>Dnešní plnění</Text>
            </Group>
            <Title order={2}>
              {completedToday}/{totalSupplements}
            </Title>
            <Text size="sm" c="dimmed">
              {completionRate}% hotovo
            </Text>
          </Card>
          <Card withBorder radius={cardRadius} padding={cardPadding}>
            <Group gap="xs">
              <IconSparkles size={24} />
              <Text fw={700}>Týdenní disciplína</Text>
            </Group>
            <Title order={2}>{weeklyScore}/7</Title>
            <Text size="sm" c="dimmed">
              Dnů, kdy bylo splněno vše.
            </Text>
          </Card>
        </SimpleGrid>

        <ReminderCard
          enabled={reminderSettings.enabled}
          time={reminderSettings.time}
          pendingCount={supplementsLeft}
          onToggle={handleReminderToggle}
          onTimeChange={handleReminderTimeChange}
          compact={isMobile}
        />

        {notificationBlocked && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            color="yellow"
            radius="md"
          >
            Notifikace máš bloklé. Povolit je můžeš v nastavení prohlížeče, aby
            tě aplikace mohla upozornit.
          </Alert>
        )}

        <Card withBorder radius={cardRadius} padding={cardPadding}>
          <Group justify="space-between" align="center">
            <div>
              <Text fw={600}>Denní poznámka</Text>
              <Text size="sm" c="dimmed">
                {insightMessage}
              </Text>
            </div>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="gradient"
              gradient={{ from: 'indigo', to: 'teal' }}
              onClick={() => setIsModalOpen(true)}
            >
              Přidat doplněk
            </Button>
          </Group>
        </Card>

        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={700}>Doplňky</Text>
            {!isEditing && (
              <Text size="sm" c="dimmed">
                Klepni na položku pro okamžité zapsání.
              </Text>
            )}
          </Group>
          {supplements.length === 0 ? (
            <Card withBorder radius={cardRadius} padding={cardPadding}>
              <Text fw={600}>Žádné položky</Text>
              <Text size="sm" c="dimmed">
                Přidej první doplněk a vytvoř si svůj rituál.
              </Text>
            </Card>
          ) : (
            <Stack gap="sm">
              {supplements.map((supplement) => (
                <SupplementItem
                  key={supplement.id}
                  supplement={supplement}
                  onTake={handleTakeSupplement}
                  isTakenToday={supplement.lastTakenDate === today}
                  isEditing={isEditing}
                  onUpdate={handleUpdateSupplement}
                  onDelete={handleDeleteSupplement}
                  compact={isMobile}
                />
              ))}
            </Stack>
          )}
        </Stack>

        <Card withBorder radius={cardRadius} padding={cardPadding}>
          <Group justify="space-between" align="baseline">
            <div>
              <Text fw={600}>Posledních 7 dní</Text>
              <Text size="sm" c="dimmed">
                Sleduj, které dny byly na 100 %.
              </Text>
            </div>
            <Text size="sm" c="dimmed">
              {weeklyScore} / 7 splněno
            </Text>
          </Group>
          <Group mt="md" gap="xs" wrap="wrap">
            {weeklyHistory.map((day) => (
              <Card
                key={day.date}
                padding="sm"
                radius="md"
                withBorder
                style={{
                  backgroundColor: day.completed
                    ? 'var(--mantine-color-teal-light)'
                    : undefined,
                }}
              >
                <Text fw={600} size="sm">
                  {day.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {day.completed ? '100%' : '---'}
                </Text>
              </Card>
            ))}
          </Group>
        </Card>
      </Stack>

      <AddSupplementForm
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSupplement}
        fullScreen={isMobile}
      />
    </Container>
  );
};

export default App;
