import constants from './constants'
const {OWNER, REPO, SHA, octokit, jobName} = constants

/**
 * Fetch GitHub check run
 * @return the check ID of the created run
 */
export default async function fetchStatusCheck(): Promise<number | undefined> {
  const checkParameters = {
    owner: OWNER,
    repo: REPO,
    ref: SHA,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }
  for await (const response of octokit.paginate.iterator(
    'GET /repos/{owner}/{repo}/commits/{ref}/check-runs',
    checkParameters,
  )) {
    const currentCheck = response.data.find((check) => check.name === jobName)
    if (currentCheck) {
      return currentCheck.id
    }
  }
  return
}
