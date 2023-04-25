import updateStatusCheck from './updateStatusCheck'
import constants from './constants'
const {OWNER, REPO, getTimestamp, checkName} = constants
import type {checkUpdateParametersType} from './types'

/**
 *
 * @param conclusion whether or not the status check was successful. Must be one of: success, failure, neutral, cancelled, skipped, timed_out, or action_required.
 * @param checkId the ID of the check run to close
 * @param summary a markdown summary of the check run results
 */
export default async function closeStatusCheck(
  conclusion: checkUpdateParametersType['conclusion'],
  checkId: checkUpdateParametersType['check_run_id'],
  summary: string,
  text: string,
): Promise<void> {
  await updateStatusCheck({
    conclusion,
    owner: OWNER,
    repo: REPO,
    completed_at: getTimestamp(),
    status: 'completed',
    check_run_id: checkId,
    output: {
      title: checkName,
      summary: summary,
      text: text,
    },
  })
}
