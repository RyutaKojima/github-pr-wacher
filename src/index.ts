import {Octokit} from '@octokit/rest'
import {PullRequestRepository, PullRequestRow} from './Repositories/PullRequestRepository'
import {DateTime, Interval, Settings} from 'luxon';

const PAGE_LIMIT: number = parseInt(process.env.PAGE_LIMIT || '', 10) || 20
const githubToken: string | undefined = process.env.GITHUB_TOKEN
const owner: string | undefined = process.env.GITHUB_OWNER
const repo: string | undefined = process.env.GITHUB_REPOSITORY

Settings.defaultZoneName = "Asia/Tokyo";

const entrypoint = async (): Promise<void> => {
    if (!owner || !repo || !githubToken) {
        console.error('ENV is not defined. It needs [GITHUB_OWNER, GITHUB_REPOSITORY, GITHUB_TOKEN]')
        return
    }
    const octokit = new Octokit({
        auth: githubToken,
        userAgent: 'github-pr-wacher v0.1.0',
        timeZone: 'Asia/Tokyo',
        baseUrl: 'https://api.github.com',
    })
    const pullRepo = new PullRequestRepository(octokit)

    const summaryPulls: PullRequestRow[] = []

    let page: number = 1
    while (1) {
        const temp = await pullRepo.fetchClosedPullRequests(owner, repo, {
            sort: 'created',
            direction: 'desc',
            per_page: 100,
            page: page
        })
        if (temp.length === 0) {
            break;
        }

        summaryPulls.push(...temp)

        console.log('progress: ' + page)
        if (page > PAGE_LIMIT) {
            console.error('infinite loop?')
            return;
        }

        page++;
    }

    // console.log(summaryPulls)

    const originRecords = summaryPulls.map((pull: PullRequestRow): {
        title: string,
        number: number,
        created_at: DateTime,
        updated_at: DateTime,
        closed_at: DateTime,
        created_month: string,
        interval_of_days: number,
    } => {
        const created_at = DateTime.fromISO(pull.created_at).setLocale('ja')
        const updated_at = DateTime.fromISO(pull.updated_at).setLocale('ja')
        const closed_at = DateTime.fromISO(pull.closed_at).setLocale('ja')
        const interval = Interval.fromDateTimes(created_at, closed_at)
        // closed_at.toFormat('yyyy-MM-dd HH:mm:ss')

        return {
            title: pull.title,
            number: pull.number,
            created_at: created_at,
            updated_at: updated_at,
            closed_at: closed_at,
            created_month: closed_at.toFormat('yyyy-MM'),
            interval_of_days: interval.length('days'),
        }
    })

    // console.log(originRecords)

    interface AnalysisType {
        month: string,
        0: number,
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        over6: number
    }

    const analysisPerMonth: Array<AnalysisType> = [];
    originRecords.forEach((row) => {
        const found: undefined | AnalysisType = analysisPerMonth.find((v) => v.month === row.created_month)
        const target: AnalysisType = found || {
            month: row.created_month,
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            over6: 0,
        }
        if (!found) {
            analysisPerMonth.push(target)
        }

        if (row.interval_of_days >= 6) {
            target.over6++;
        } else {
            const integerOfInterval: number = Math.floor(row.interval_of_days)
            const key: (keyof AnalysisType) = integerOfInterval as (keyof AnalysisType)
            target[key]++;
        }
    })

    analysisPerMonth.sort((a, b) => a.month < b.month ? -1 : 1)

    const viewTable: Array<any> = [
        ['month', '0 day', '1 day', '2 day', '3 day', '4 day', '5 day', 'over 6 days'],
        ...analysisPerMonth.map((row: AnalysisType) => [
            row.month,
            row["0"],
            row["1"],
            row["2"],
            row["3"],
            row["4"],
            row["5"],
            row.over6,
        ])
    ]

    console.table(viewTable)
}

entrypoint()
