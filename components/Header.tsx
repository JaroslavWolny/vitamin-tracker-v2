import React from 'react';
import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';

interface HeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  completionRate: number;
  todayLabel: string;
  supplementsLeft: number;
  isCompact?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isEditing,
  onToggleEdit,
  completionRate,
  todayLabel,
  supplementsLeft,
  isCompact = false,
}) => {
  const ringSize = isCompact ? 86 : 110;
  const ringThickness = isCompact ? 10 : 12;

  return (
    <Paper
      radius="xl"
      p={isCompact ? 'md' : 'lg'}
      withBorder
      style={{
        background:
          'linear-gradient(135deg, rgba(97, 74, 255, 0.9), rgba(52, 211, 153, 0.85))',
      }}
    >
      <Group
        align="stretch"
        justify="space-between"
        wrap={isCompact ? 'wrap' : 'nowrap'}
        gap={isCompact ? 'lg' : 'xl'}
      >
        <Stack gap={isCompact ? 4 : 8} style={{ flex: 1, minWidth: 0 }}>
          <Badge color="white" variant="light" size="lg">
            {todayLabel}
          </Badge>
          <div>
            <Title order={isCompact ? 3 : 2} c="white" fw={800}>
              Dávky pod kontrolou
            </Title>
            <Text c="white" opacity={0.85} size={isCompact ? 'xs' : 'sm'}>
              {supplementsLeft === 0
                ? 'Vše hotovo, můžeš chillovat ✨'
                : `Zbývá vyřešit ${supplementsLeft} položek.`}
            </Text>
          </div>
        </Stack>
        <Stack
          align="center"
          gap="xs"
          style={{ minWidth: isCompact ? '100%' : 'auto' }}
        >
          <RingProgress
            sections={[{ value: completionRate, color: '#34d399' }]}
            label={
              <Text c="white" fw={700} size="md">
                {completionRate}%
              </Text>
            }
            size={ringSize}
            thickness={ringThickness}
          />
          <ActionIcon
            aria-label="Přepnout režim úprav"
            size={isCompact ? 'md' : 'lg'}
            radius="xl"
            variant="white"
            onClick={onToggleEdit}
          >
            {isEditing ? <IconCheck size={18} /> : <IconPencil size={18} />}
          </ActionIcon>
        </Stack>
      </Group>
    </Paper>
  );
};

export default Header;
