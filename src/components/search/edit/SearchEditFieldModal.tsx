import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  Select,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import styled from "@emotion/styled";
import { start } from "repl";
import { useForm } from "@mantine/form";
import { SearchEntryField } from "../../../types/LibraryTypes";
import useStore from "../../../store";
import { useEffect, useState } from "react";
import { SearchValidator } from "../../../types/LibraryTypes";

const ModalContainer = styled(Modal)`
  .mantine-Modal-header {
    background-color: #282c34;
    color: white;
  }
  .mantine-Modal-content {
    background-color: #282c34;
    border-radius: 5px;
  }
  .mantine-Modal-body {
    border-radius: 0;
  }
`;

const SearchEditFieldForm = styled.div`
  display: grid;
  gap: 1rem;
`;

const TextInputStyled = styled(TextInput)`
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
  & .mantine-TextInput-label {
    color: white;
  }
  width: 250px;
`;

const TextAreaStyled = styled(Textarea)`
  & .mantine-Textarea-input {
    color: white;
    background-color: transparent;
  }
  & .mantine-Textarea-label {
    color: white;
  }
`;

const SelectStyled = styled(Select)`
  width: 250px;
  & .mantine-Input-input {
    color: white;
    background-color: #282c34;
  }

  & .mantine-Select-label {
    color: white;
    font-size: smaller;
  }

  & .mantine-Select-item {
    color: white;
    margin: 0.1rem;
    font-size: small;
    &[data-selected="true"],
    &[data-hovered="true"] {
      background-color: #476480;
    }
  }

  & .mantine-Select-dropdown {
    background-color: #282c34;
  }
`;
// export type SearchEntryField = {
//   name: string;
//   type: string;
//   variables: string[];
//   delimiters?: string[];
//   data?: string[];
// };

// export type SearchValidator = {
//   values?: string[];
//   pattern?: string;
//   type?: string;
//   path?: string;
//   required?: boolean;
//   minLength?: number;
//   identifier?: string;
//   tag?: string;
//   default?: string;
// };

const DEFAULT_VALUES = {
  name: "",
  type: "",
  variables: [],
};

const SearchEditFieldModal = ({
  field,
  opened,
  onClose,
}: SearchEditFieldModalProps) => {
  const [_opened, { open, close }] = useDisclosure();
  const [state, setState] = useState<{
    field: SearchEntryField;
    validator: SearchValidator;
  }>({
    field: { ...DEFAULT_VALUES, ...field },
    validator: {},
  });
  const search = useStore(({ search }) => search);
  console.log(field);
  useEffect(() => {
    if (field && search) {
      const { validator } = search;
      if (validator[field.name]) {
        setState((cur) => ({
          ...cur,
          validator: validator[field.name],
        }));
      }
    }
    return close;
  }, [search, field]);

  return (
    <>
      <ModalContainer
        opened={opened}
        onClose={onClose}
        title="Configure Field"
        centered
        size="xl"
        overlayProps={{
          color: "white",
          opacity: 0.55,
          blur: 3,
        }}
      >
        <SearchEditFieldForm>
          <Title order={3} weight="normal" color="white">
            Settings
          </Title>
          <TextInputStyled
            label="Name"
            value={state.field.name}
            onChange={(evt) =>
              setState((cur) => ({
                ...cur,
                field: { ...cur.field, name: evt.target.value },
              }))
            }
          />
          <TextAreaStyled
            description="Comma seperated values"
            label="Variables"
            value={state.field.variables.toString()}
            onChange={(evt) => {
              const variables = evt.target.value.split(",");
              setState((cur) => ({
                ...cur,
                field: { ...cur.field, variables },
              }));
            }}
          />
          <TextInputStyled
            description="Comma seperated values"
            label="Delimiters"
            value={state.field.delimiters?.toString()}
            onChange={(evt) => {
              const delimiters = evt.target.value.split(",");
              setState((cur) => ({
                ...cur,
                field: { ...cur.field, delimiters },
              }));
            }}
          />

          <SelectStyled
            data={[
              { value: "select", label: "Select" },
              { value: "input", label: "Input" },
            ]}
            label="Type"
            value={state.field.type}
          />
          {/* Conditionaly show for each type: [Select, Input] */}

          <Divider />
          <Title order={3} weight="normal" color="white">
            Validator
          </Title>
          <Group style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Checkbox
              label="Required"
              checked={state.validator.required || false}
              onChange={(evt) => {
                setState((cur) => ({
                  ...cur,
                  validator: { ...cur.validator, required: evt.target.checked },
                }));
              }}
              style={{ gridColumn: "1 / 3", justifySelf: "start" }}
              styles={{
                label: {
                  color: "white",
                },
              }}
            />
            {/* todo number input */}
            <TextInputStyled
              label="Minimum Length"
              value={state.validator.minLength}
              onChange={(evt) =>
                setState((cur) => ({
                  ...cur,
                  validator: { ...cur.validator, minLength: +evt.target.value },
                }))
              }
            />
            <TextInputStyled
              label="Identifier"
              value={state.validator.identifier}
              onChange={(evt) =>
                setState((cur) => ({
                  ...cur,
                  validator: { ...cur.validator, identifier: evt.target.value },
                }))
              }
            />
            <TextInputStyled
              label="Pattern Match"
              value={state.validator.pattern}
              onChange={(evt) =>
                setState((cur) => ({
                  ...cur,
                  validator: { ...cur.validator, pattern: evt.target.value },
                }))
              }
            />
            <TextInputStyled
              label="Tag"
              value={state.validator.tag}
              onChange={(evt) =>
                setState((cur) => ({
                  ...cur,
                  validator: { ...cur.validator, tag: evt.target.value },
                }))
              }
            />
            <TextInputStyled
              label="Default Value"
              value={state.validator.default}
              onChange={(evt) =>
                setState((cur) => ({
                  ...cur,
                  validator: { ...cur.validator, default: evt.target.value },
                }))
              }
            />
          </Group>
          <Button
            style={{ justifySelf: "start" }}
            onClick={() => {
              // TODO: add field config to search.fields
              // add validation to search.validator[field.name]
            }}
          >
            Save
          </Button>
        </SearchEditFieldForm>
      </ModalContainer>

      <Group>
        <Button onClick={open}>Add Field</Button>
      </Group>
    </>
  );
};

interface SearchEditFieldModalProps {
  field?: SearchEntryField;
  opened: boolean;
  onClose: () => void;
}

export default SearchEditFieldModal;
