import {getJson, postJson, putJson} from "./index";

export async function fetchImpactReportInterfaces() {
  return getJson('/api/impactReports/interface');
}

export async function fetchImpactReports(organizationUri) {
  return getJson('/api/impactReports/' + organizationUri + '/');
}

export async function fetchImpactReport(uri) {
  return getJson('/api/impactReport/' + uri);
}

export async function createImpactReport(params) {
  return postJson(`/api/impactReport/`, params);
}

export async function updateIndicator(params, uri) {
  return putJson(`/api/indicator/${uri}`, params);
}