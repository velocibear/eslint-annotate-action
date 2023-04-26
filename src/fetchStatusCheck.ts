import constants from './constants'
const {OWNER, REPO, SHA, octokit} = constants

/**
 * Fetch GitHub check run
 * @return the check ID of the created run
 */
export default async function fetchStatusCheck(): Promise<number> {
  const check = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/check-runs', {
    owner: OWNER,
    repo: REPO,
    ref: SHA,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  console.log('check', check)

  // Return the status check ID
  return check.data.check_runs?.[0].id as number
}
