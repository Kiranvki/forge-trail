import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
import { authorize, asUser } from "@forge/api";
import { requestJira } from '@forge/bridge';

const resolver = new Resolver();

// resolver.define('fetchLabels', async (req) => {
//   const key = req.context.extension.issue.key;

//   const res = await api.asUser().requestJira(route`/rest/api/3/issue/${key}?fields=labels`);

//   const data = await res.json();

//   const label = data.fields.labels;
//   if (label == undefined) {
//     console.warn(`${key}: Failed to find labels`);
//     return [];
//   }

//   return label;
// });

// const handleSubmit = async () => {
//   const response = await api.asUser().requestJira(route`/rest/api/3/search`);
//   const data = await response.json();
//   console.log("kiran", data);
//   setNewData(data.total);
//   return data.total;
// };

resolver.define("fetch-total", async (req) => {
  const jiraResponse = await api
    .asUser()
    .requestJira(route`/rest/api/3/search`);
  const data = await jiraResponse.json();
  console.log('secdon', data)
  return {
    jiraResponse: await data.total
  };
});

export const handler = resolver.getDefinitions();
