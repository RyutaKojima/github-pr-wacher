import {Octokit} from "@octokit/rest";

export interface PullRequestRow {
    url: string,
    id: number,
    number: number,
    state: string,
    title: string,
    created_at: string,
    updated_at: string,
    closed_at: string,
    merged_at: string,
    merge_commit_sha: string,
    assignees: Array<any>,
    requested_reviewers: Array<object>
}

export class PullRequestRepository {
    private octokit: Octokit;

    constructor(octokit: Octokit) {
        this.octokit = octokit
    }

    private async fetchPullRequests(owner: string, repo: string, option: object = {}): Promise<Array<PullRequestRow>> {
        const {data: pulls} = await this.octokit.pulls.list({
            owner,
            repo,
            ...option
        });

        // console.log(pulls)

        return pulls.map((pull) => ({
            url: pull.url,
            id: pull.id,
            number: pull.number,
            state: pull.state,
            title: pull.title,
            created_at: pull.created_at,
            updated_at: pull.updated_at,
            closed_at: pull.closed_at,
            merged_at: pull.merged_at,
            merge_commit_sha: pull.merge_commit_sha,
            assignees: pull.assignees,
            requested_reviewers: pull.requested_reviewers
        }))
    }

    async fetchClosedPullRequests(owner: string, repo: string, option: object = {}): Promise<Array<PullRequestRow>> {
        return await this.fetchPullRequests(owner, repo, {
            ...option,
            state: 'closed',
        });
    }
}