import { useEffect, useState } from "react";
import { readEnvVariable } from "../../../helpers/env.helper";
import { Select, Text } from "@mantine/core";

const getBibles = async () => {
  const key = await readEnvVariable("PLUGIN_BIBLE_API_KEY");
  const response = await fetch(
    "https://api.scripture.api.bible/v1/bibles?language=eng",
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": key || "",
      },
    }
  );
  const { data } = await response.json();
  return data;
};

const VersesView = () => {
  const [bibles, setBibles] = useState<
    {
      id: string;
      dblId: string;
      abbreviation: string;
      abbreviationLocal: string;
      language: any;
      countries: any;
      name: string;
      nameLocal: string;
      description: string;
      descriptionLocal: string;
      relatedDbl: string;
      type: string;
      updatedAt: string;
    }[]
  >([]);

  useEffect(() => {
    getBibles().then(setBibles);
  }, []);

  return (
    <div>
      <Select
        searchable={true}
        data={bibles.map((bible) => ({
          value: bible.abbreviationLocal,
          label: bible.name,
        }))}
      />
    </div>
  );
};

export default VersesView;
