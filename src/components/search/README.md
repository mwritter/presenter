## Users Guide

Steps to create a 'Search Entry'

1. Navigate to the search section
2. Click on the Search add icon
3. Enter Search Entry name and press enter
4. Add all the needed fields for your search entry
5. Enter in the search entry url using the field variables needed for the search
6. Add any needed API headers

Steps to adding a 'Search Entry Field'

1.  Click 'Add Field'
2.  Give your field a name
3.  Add the variables that this field with be responsible for to use within the Search Entry URL
4.  Add any 'delimiters' that should be used to set this fields variables
5.  Select this fields types
6.  Add validation to this fields variables
7.  Click Save

Field Variable Validation

- Required
  - This options is here to make variables optional or required
- Minimum Length
  - This validation is for the minimum amount of characters that the variable should have before its used.
- Pattern Match
  - This validation should be a regular expression for validating the variable is correct
- Default Value
  - This value will be used if no value is given
- Identifier
  - This is specifically formatted text that will be used in the 'slides identification' on the playlist for this variable
- Tag
  - This is specifically formatted text that will be used as the 'tag' on each slide for this variable

## Technical Guide

The 'Search' section is power by on `JSON` file with an array of 'Search Entries' located at the `APPDATA` directory on your local machine.

```json
[
  {
    "name": "Search API",
    "type": "api",
    "identifier": "API Slides",
    "extractor": {
      "url": "http://example.com/{{first}}",
      "urlJSON": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"http://example.com/\"},{\"type\":\"mention\",\"attrs\":{\"id\":\"{{first}}\",\"label\":\"first\"}}]}]}",
      "type": "array",
      "headers": "{}"
    },
    "validator": {
      "first": { "minLength": 4, "tag": "{{first}}" },
      "second": { "required": true, "minLength": 2 },
      "third": { "tag": "{{tag}}" }
    },
    "fields": [
      {
        "id": "1",
        "name": "Field Name",
        "type": "input",
        "variables": ["first", "second"],
        "delimiters": [":"]
      }
    ]
  }
]
```

Search Eentry Properties
| Property | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| `identifier` | The text or header that identifies the slides in the playlist view |
| `extractor` | An object that holds the specifics about the API, the URL the return type, and additional headers |
| `validator` | This is the 'rules' around each variable, and how they should be used within the slides `tag` and `identifier` |
| `fields` | A list of inputs and some configuration for them - name, type, variables, and delimiters |

The `extractor`
| Property | Description |
|----------|-------------|
| `url` | used to query the specified API. The `extractor.url` can be constructed with any field variables using double curly braces (`{{}}`). In the example `JSON` above, we would make a `GET` request to `http://example.com/{{first}}` where `{{first}}` would be replace with whatever was entered into the field before the first delimitor. |
| `urlJSON` | only used to display the Search Entry url in a user friendly way, giving the user an easy way to see what variables are being used in the url. |
| `type` | the return type of the API - only supports `array` right now |
| `headers` | any needed headers for the api |
| `keys` | Used to extract the text from an `array` of objects |

The `validator` is an object that hold validation and rules for each fields variables. The keys of the `validator` correspond to the variables in each field. The value correspones the the variables rules.
Rules \* all rules are optional
| Property | Description |
|----------|-------------|
| `minLength` | `number` - the minimum character length of the variable, before it is usable in the query |
| `required` | `boolean` - indicates if the variable is requried or not |
| `pattern` | `string` - this should be a Regular Expression to validate the variable |
| `default` | `string` - this is a default value that is used if the variable is not set |
| `indicator` | `string` - specifically formatted string that indicates how this variable is used in the slide `indicator` on the playlist |
| `tag` | `string` - specifically formatted string that indicates how this variable is used in each slides tag |

`fields` is an array of field configurations
| Property | Description |
|----------|-------------|
| `id` | Unique identifier for each field |
| `name` | Display name for the field |
| `type` | Type of field - only `input` and `select` fields are possible at this time |
| `variables` | The variables that this field is responsible for |
| `delimiters` | The break point for each variable |
