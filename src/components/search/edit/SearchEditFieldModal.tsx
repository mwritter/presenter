import { useDisclosure } from "@mantine/hooks";
import {
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
import { SearchEntryField, SearchEntryType } from "../../../types/LibraryTypes";
import useStore from "../../../store";
import { useCallback, useEffect, useState } from "react";
import { SearchValidator } from "../../../types/LibraryTypes";
import { editSearchEntry } from "../../../helpers/search.helper";
import SearchEditFieldVariableValidators from "./SearchEditFieldVariableValidators";

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

const DEFAULT_VALUES = {
  id: "",
  name: "",
  type: "",
  variables: [],
  delimiters: [],
  data: [], // only used for for field type 'select'
};

const SearchEditFieldModal = ({
  field,
  opened,
  onClose,
}: SearchEditFieldModalProps) => {
  const [_opened, { open, close }] = useDisclosure();
  const [state, setState] = useState<{
    field: SearchEntryField;
    validator: SearchEntryType["validator"];
    currentValidator: string | null;
  }>({
    field: DEFAULT_VALUES,
    validator: {},
    currentValidator: null,
  });
  const search = useStore(({ search }) => search);

  const resetState = useCallback(() => {
    setState({
      field: DEFAULT_VALUES,
      validator: {},
      currentValidator: null,
    });
  }, []);

  const _onClose = useCallback(() => {
    // might wan't to confirm before closing
    // call user onClose
    onClose?.();
    // call modal close
    close();
  }, []);

  const setValidator = useCallback(
    (variable: string, validator: SearchValidator) => {
      setState((cur) => ({
        ...cur,
        validator: { ...cur.validator, [variable]: validator },
      }));
    },
    []
  );

  useEffect(() => {
    if (field && search) {
      const { validator = {} } = search;
      // TODO: we'll need to search for the field.name and validator keys all in lowercase
      // also document thats how we find the validator
      setState((cur) => ({
        ...cur,
        field,
        validator,
        currentValidator: field.variables[0] || null,
      }));
    } else {
      setState({
        field: DEFAULT_VALUES,
        validator: {},
        currentValidator: null,
      });
    }
  }, [search, field]);

  return (
    <>
      <ModalContainer
        opened={_opened || opened}
        onClose={_onClose}
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
            description="Comma seperated values with no spaces"
            label="Variables"
            value={state.field.variables.toString()}
            onChange={(evt) => {
              const variables = evt.target.value.split(",");
              setState((cur) => {
                return {
                  ...cur,
                  field: {
                    ...cur.field,
                    variables: variables.map((v) => v.trim()),
                  },
                };
              });
            }}
          />
          <TextInputStyled
            description="Comma seperated values with no spaces"
            label="Delimiters"
            value={state.field.delimiters?.toString()}
            onChange={(evt) => {
              const delimiters = evt.target.value.split(",");
              setState((cur) => ({
                ...cur,
                field: {
                  ...cur.field,
                  delimiters,
                },
              }));
            }}
          />

          <SelectStyled
            data={[
              { value: "select", label: "Select" },
              { value: "input", label: "Input" },
            ]}
            label="Type"
            onChange={(type) => {
              if (type) {
                setState((cur) => ({
                  ...cur,
                  field: {
                    ...cur.field,
                    type,
                  },
                }));
              }
            }}
            value={state.field.type}
          />
          {/* Conditionaly show for each type: [Select, Input] */}
          {/* This is going to have to be its own component */}
          <Divider />
          {state.field.variables.length ? (
            <div>
              <SelectStyled
                label="Variable"
                data={state.field.variables}
                value={state.currentValidator}
                onChange={(variable) => {
                  if (!variable) return;
                  setState((cur) => ({ ...cur, currentValidator: variable }));
                }}
              />
              {state.currentValidator && (
                <SearchEditFieldVariableValidators
                  variable={state.currentValidator}
                  validator={state.validator}
                  setValidator={setValidator}
                />
              )}
            </div>
          ) : null}
          <Group>
            <Button
              style={{ justifySelf: "start" }}
              onClick={() => {
                // DONE: add field config to search.fields
                // we'll also need to update the search.validator
                // add validation to search.validator[field.name]
                // resetState once we've updated search.fields
                // there should be a corresponding validator for each variable
                // TODO: just save the field settings for now then work on the validator part
                if (search) {
                  const { fields, ...oldSearch } = search;
                  if (field) {
                    // edit
                    const foundField = fields.findIndex(
                      (field) => field.name === state.field.name
                    );
                    fields.splice(foundField, 1, state.field);
                  } else {
                    // add
                    if (state.field.name.trim().length && state.field.type) {
                      fields.push(state.field);
                    }
                  }
                  editSearchEntry({
                    ...oldSearch,
                    fields,
                    validator: state.validator,
                  });
                }
                resetState();
                _onClose();
              }}
            >
              Save
            </Button>
            <Button
              color="red"
              onClick={() => {
                resetState();
                _onClose();
              }}
            >
              Cancel
            </Button>
            {field && (
              <Button
                color="red"
                onClick={() => {
                  if (search) {
                    const { fields, ...oldSearch } = search;
                    const foundField = fields.findIndex(
                      (field) => field.name === state.field.name
                    );
                    fields.splice(foundField, 1);
                    editSearchEntry({ ...oldSearch, fields });
                    resetState();
                    _onClose();
                  }
                }}
              >
                Delete
              </Button>
            )}
          </Group>
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
