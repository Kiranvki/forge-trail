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

resolver.define("fetch-workLoad", async ({ payload, context, event }) => {
  const issueKey = payload.issueKey
  const jiraResponse = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}`);
  // const eventKey = await event.issue.id
  const data = await jiraResponse.json();
  console.log('secdon', data)

  return {
    jiraResponse: await data
    // eventKey: await data
  };
});

resolver.define("fetch-workProductType", async ({ payload, context}) => {
  const issueTypeId = payload.issueTypeId
  const projectKeys = payload.projectKey
  // const {issueTypeId,projectKey}=payload
  const jiraResponse = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/createmeta?projectKeys=${projectKeys}&issuetypeIds=${issueTypeId}&expand=projects.issuetypes.fields`);
  // const eventKey = await event.issue.id
  const data = await jiraResponse.json();
  const response=await data.projects[0].issuetypes[0].fields.customfield_10046.allowedValues

  return {
    jiraResponse: await response
    // eventKey: await data
  };
});


// export const issueResolver = async (event, context) => {
//   try {
//     console.log('event.issue.key', event.issue.key)
//     let r = await api.asUser().requestJira(route`/rest/api/3/issue/TES-3`);
//     console.log('r', r)
//   }catch(e){
//     console.log('e', e)
//   }
// }



export const handler = resolver.getDefinitions();
