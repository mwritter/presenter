import styled from "@emotion/styled";
import { Checkbox, Group, TextInput, Title } from "@mantine/core";
import { SearchEntryType, SearchValidator } from "../../../types/LibraryTypes";
import { useEffect, useMemo, useState } from "react";

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

const SearchEditFieldVariableValidators = ({
  variable,
  validator,
  setValidator,
}: SearchEditFieldVariableValidatorsProps) => {
  const [current, setCurrent] = useState<SearchValidator>();
  const validators = useMemo(() => {
    const map = new Map();
    if (validator[variable] && !map.get(variable)) {
      map.set(variable, validator[variable]);
    } else if (!validator[variable]) {
      map.set(variable, {});
    }
    return map;
  }, [variable, validator]);

  useEffect(() => {
    setCurrent(validator[variable]);
  }, [validator, variable]);

  return (
    <>
      <Title mt={10} order={3} weight="normal" color="white">
        Validator for {variable}
      </Title>
      <Group style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <Checkbox
          label="Required"
          checked={validators.get(variable)?.required || false}
          onChange={(evt) => {
            setValidator(variable, {
              ...current,
              required: evt.target.checked,
            });
          }}
          style={{ gridColumn: "1 / 3", justifySelf: "start" }}
          styles={{
            label: {
              color: "white",
            },
          }}
        />
        <TextInputStyled
          label="Minimum Length"
          description="Is there a minimum character length?"
          value={validators.get(variable)?.minLength || ""}
          onChange={(evt) => {
            setValidator(variable, {
              ...current,
              minLength: +evt.target.value,
            });
          }}
        />
        <TextInputStyled
          label="Identifier"
          description="How should this field contribute to the slides identifier?"
          value={validators.get(variable)?.identifier || ""}
          onChange={(evt) =>
            setValidator(variable, {
              ...current,
              identifier: evt.target.value,
            })
          }
        />
        <TextInputStyled
          label="Pattern Match"
          description="Regex validation"
          value={validators.get(variable)?.pattern || ""}
          onChange={(evt) =>
            setValidator(variable, { ...current, pattern: evt.target.value })
          }
        />
        <TextInputStyled
          label="Tag"
          description="How should this field contribute to the slides tag?"
          value={validators.get(variable)?.tag || ""}
          onChange={(evt) =>
            setValidator(variable, { ...current, tag: evt.target.value })
          }
        />
        <TextInputStyled
          label="Default Value"
          description="If no input is give, we will use this default value"
          value={validators.get(variable)?.default || ""}
          onChange={(evt) =>
            setValidator(variable, { ...current, default: evt.target.value })
          }
        />
      </Group>
    </>
  );
};

interface SearchEditFieldVariableValidatorsProps {
  variable: string;
  validator: SearchEntryType["validator"];
  setValidator: (variable: string, validator: SearchValidator) => void;
}

export default SearchEditFieldVariableValidators;
