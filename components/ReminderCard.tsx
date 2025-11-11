import React from 'react';
import { Card, Group, Stack, Switch, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconBellRinging, IconClock } from '@tabler/icons-react';

interface ReminderCardProps {
  enabled: boolean;
  time: string;
  onToggle: (value: boolean) => void;
  onTimeChange: (value: string) => void;
  pendingCount: number;
  compact?: boolean;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  enabled,
  time,
  onToggle,
  onTimeChange,
  pendingCount,
  compact = false,
}) => {
  const radius = compact ? 'lg' : 'xl';
  const padding = compact ? 'md' : 'lg';

  return (
    <Card withBorder radius={radius} padding={padding}>
      <Stack gap="md">
        <Group justify="space-between" wrap={compact ? 'wrap' : 'nowrap'}>
          <Group gap="xs">
            <IconBellRinging size={24} stroke={1.5} />
            <Text fw={600}>Smart připomínka</Text>
          </Group>
          <Switch
            size="lg"
            checked={enabled}
            onChange={(event) => onToggle(event.currentTarget.checked)}
          />
        </Group>
        <Text size="sm" c="dimmed">
          {pendingCount === 0
            ? 'Vše hotovo, další notifikaci dnes neposíláme.'
            : 'Odešleme notifikaci, pokud do vybraného času stále něco zbývá.'}
        </Text>
        <Group
          wrap={compact ? 'wrap' : 'nowrap'}
          gap={compact ? 'md' : 'lg'}
          align="center"
        >
          <Group gap="xs" style={{ flexGrow: 1 }}>
            <IconClock size={20} stroke={1.5} />
            <Text size="sm" fw={600}>
              {pendingCount === 0
                ? 'Dnešní plán splněn'
                : `Zbývá ${pendingCount} položek`}
            </Text>
          </Group>
          <TimeInput
            disabled={!enabled}
            label="Denní upozornění"
            value={time}
            onChange={(event) => onTimeChange(event.currentTarget.value)}
            withAsterisk
            style={{
              flexGrow: compact ? 1 : 0,
              minWidth: compact ? '100%' : 220,
            }}
          />
        </Group>
      </Stack>
    </Card>
  );
};

export default ReminderCard;
