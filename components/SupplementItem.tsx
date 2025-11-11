import React from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconCheck, IconClock, IconPill, IconTrash } from '@tabler/icons-react';
import type { Supplement } from '../types';
import { formatTimeLabel } from '../utils/dateUtils';

interface SupplementItemProps {
  supplement: Supplement;
  onTake: (id: string) => void;
  isTakenToday: boolean;
  isEditing: boolean;
  onUpdate?: (id: string, data: Partial<Supplement>) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const categoryLabels: Record<Supplement['category'], string> = {
  vitamin: 'Vitamín',
  creatine: 'Kreatin',
  other: 'Jiné',
};

const SupplementItem: React.FC<SupplementItemProps> = ({
  supplement,
  onTake,
  isTakenToday,
  isEditing,
  onUpdate,
  onDelete,
  compact = false,
}) => {
  const radius = compact ? 'lg' : 'xl';
  const padding = compact ? 'md' : 'lg';

  if (isEditing) {
    return (
      <Card withBorder radius={radius} padding={padding}>
        <Stack gap="sm">
          <Group
            align="flex-start"
            justify="space-between"
            wrap={compact ? 'wrap' : 'nowrap'}
            gap="sm"
          >
            <TextInput
              label="Název"
              value={supplement.name}
              onChange={(event) =>
                onUpdate?.(supplement.id, { name: event.currentTarget.value })
              }
              flex={compact ? undefined : 1}
              style={{ flex: compact ? '1 1 100%' : undefined }}
            />
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => onDelete?.(supplement.id)}
              aria-label="Smazat doplněk"
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
          <TextInput
            label="Dávkování / Poznámka"
            value={supplement.dosage}
            onChange={(event) =>
              onUpdate?.(supplement.id, { dosage: event.currentTarget.value })
            }
          />
          <Group grow gap="sm" align="flex-end" wrap={compact ? 'wrap' : 'nowrap'}>
            <Select
              label="Kategorie"
              data={[
                { value: 'vitamin', label: 'Vitamíny' },
                { value: 'creatine', label: 'Kreatin' },
                { value: 'other', label: 'Jiné' },
              ]}
              value={supplement.category}
              onChange={(value) =>
                value &&
                onUpdate?.(supplement.id, {
                  category: value as Supplement['category'],
                })
              }
            />
            <NumberInput
              label="Upomínka (hodina)"
              min={4}
              max={22}
              value={supplement.reminderHour}
              onChange={(value) =>
                typeof value === 'number' &&
                onUpdate?.(supplement.id, { reminderHour: value })
              }
              style={{ flex: compact ? '1 1 100%' : undefined }}
            />
          </Group>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      withBorder
      radius={radius}
      padding={padding}
      shadow="sm"
      style={{
        borderColor: isTakenToday ? 'var(--mantine-color-green-4)' : undefined,
        opacity: isTakenToday ? 0.75 : 1,
      }}
    >
      <Stack gap={compact ? 'md' : 'sm'}>
        <Group align="flex-start" gap="md" wrap={compact ? 'wrap' : 'nowrap'}>
          <ActionIcon
            variant={isTakenToday ? 'filled' : 'light'}
            color={isTakenToday ? 'green' : 'indigo'}
            radius="xl"
            size={compact ? 'lg' : 'xl'}
            onClick={() => onTake(supplement.id)}
            aria-label="Označit jako užité"
          >
            {isTakenToday ? <IconCheck size={18} /> : <IconPill size={18} />}
          </ActionIcon>
          <Stack gap={compact ? 4 : 6} style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs">
              <Text fw={600}>{supplement.name}</Text>
              <Badge color="gray" variant="light" radius="sm">
                {categoryLabels[supplement.category]}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {supplement.dosage}
            </Text>
            <Group gap="xs" wrap="nowrap">
              <IconClock size={16} stroke={1.5} />
              <Text size="xs" c="dimmed">
                {`Další připomínka v ${formatTimeLabel(supplement.reminderHour)}`}
              </Text>
            </Group>
          </Stack>
        </Group>
        <Button
          variant={isTakenToday ? 'light' : 'gradient'}
          gradient={{ from: 'indigo', to: 'green' }}
          onClick={() => onTake(supplement.id)}
          disabled={isTakenToday}
          fullWidth={compact}
        >
          {isTakenToday ? 'Už hotovo' : 'Splněno'}
        </Button>
      </Stack>
    </Card>
  );
};

export default SupplementItem;
