import React, { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import type { SupplementCategory } from '../types';

export interface SupplementDraft {
  name: string;
  dosage: string;
  category: SupplementCategory;
  reminderHour: number;
}

interface AddSupplementFormProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (draft: SupplementDraft) => void;
  fullScreen?: boolean;
}

const defaultDraft: SupplementDraft = {
  name: '',
  dosage: '',
  category: 'vitamin',
  reminderHour: 9,
};

const AddSupplementForm: React.FC<AddSupplementFormProps> = ({
  opened,
  onClose,
  onAdd,
  fullScreen = false,
}) => {
  const [draft, setDraft] = useState<SupplementDraft>(defaultDraft);
  const isValid = draft.name.trim().length > 1;

  useEffect(() => {
    if (!opened) {
      setDraft(defaultDraft);
    }
  }, [opened]);

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      ...draft,
      name: draft.name.trim(),
      dosage: draft.dosage.trim() || '1 dávka',
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Nový doplněk"
      centered={!fullScreen}
      fullScreen={fullScreen}
      radius={fullScreen ? 0 : 'xl'}
    >
      <Stack>
        <TextInput
          label="Název"
          placeholder="Např. Komplex vitamínů B"
          value={draft.name}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, name: event.currentTarget.value }))
          }
          required
        />
        <TextInput
          label="Dávkování"
          placeholder="1 kapsle po snídani"
          value={draft.dosage}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, dosage: event.currentTarget.value }))
          }
        />
        <Group grow>
          <Select
            label="Kategorie"
            data={[
              { value: 'vitamin', label: 'Vitamíny' },
              { value: 'creatine', label: 'Kreatin' },
              { value: 'other', label: 'Jiné' },
            ]}
            value={draft.category}
            onChange={(value) =>
              value &&
              setDraft((prev) => ({
                ...prev,
                category: value as SupplementCategory,
              }))
            }
          />
          <NumberInput
            label="Upomínka (hodina)"
            value={draft.reminderHour}
            onChange={(value) =>
              typeof value === 'number' &&
              setDraft((prev) => ({ ...prev, reminderHour: value }))
            }
            min={5}
            max={22}
            step={1}
          />
        </Group>
        <Group justify="flex-end" mt="md" gap="sm" wrap="wrap">
          <Button variant="default" onClick={onClose} fullWidth={fullScreen}>
            Zavřít
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            fullWidth={fullScreen}
          >
            Přidat
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddSupplementForm;
