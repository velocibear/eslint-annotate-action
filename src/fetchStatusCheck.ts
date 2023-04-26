import constants from './constants'
const {OWNER, REPO, SHA, octokit, jobName} = constants

/**
 * Fetch GitHub check run
 * @return the check ID of the created run
 */
export default async function fetchStatusCheck(): Promise<number | undefined> {
  //   const jobParameters = {
  //     owner: OWNER,
  //     repo: REPO,
  //     run_id: Number(process.env['GITHUB_RUN_ID']),
  //     per_page: 100,
  //     headers: {
  //       'X-GitHub-Api-Version': '2022-11-28',
  //     },
  //   }

  //   const response = await octokit.paginate('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', jobParameters)
  //   console.log('response', response)
  //   console.log('jobs', response.jobs)

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
    console.log(currentCheck)

    // for (const check of response.data.check_runs) {
    //   console.log('check', check)
    // }
    // // Return the status check ID
    // return response.data.check_runs?.[0].id as number
  }
  return
}
