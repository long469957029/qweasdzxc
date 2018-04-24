#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests

GITLAB_URL = 'http://gitlab.5x5x.com'
GITLAB_API_URL = GITLAB_URL + '/api/v4'
GITLAB_API_TOKEN = '-yArmXPggB5NkaBZvyLd'
GITLAB_PROJECT_NAME = 'global/wx-forehead-pc'
GITLAB_PROJECT_NAME_ENC = GITLAB_PROJECT_NAME.replace('/', '%2F')
SENTRY_API_URL = 'http://sentry.5x5x.com/api/0'
SENTRY_API_TOKEN = 'd7d1f505291d4f658af062ac6a7edc5aec68a9cbd4fd45b9861ecb7e3e1f3844'
SENTRY_PROJECT = 'wx-pc'
SENTRY_ORGANIZATION = 'sentry'

tags = []
page = 1
while page:
    res = requests.get(
        GITLAB_API_URL + '/projects/' + GITLAB_PROJECT_NAME_ENC + '/repository/tags',
        params={
            'page': page,
            'per_page': 100,
        },
        headers={
            'Private-Token': GITLAB_API_TOKEN,
        },
    )
    res.raise_for_status()
    tags.extend(res.json())
    page = res.headers.get('X-Next-Page', 0)
    print(res.json())

tags = list(sorted(tags, key=lambda tag: tag['commit']['created_at']))
tags = tags[-4:]
print('Sorted releases:', tags)
print('>>> Found a total of', len(tags), 'tags')

previous_tag, tags = tags[0], tags[1:]
for tag in tags:
    print('>>> Reading changes from', previous_tag['name'], 'to', tag['name'])
    res = requests.get(
        GITLAB_API_URL + '/projects/' + GITLAB_PROJECT_NAME_ENC + '/repository/compare',
        params={
            'from': previous_tag['name'],
            'to': tag['name'],
        },
        headers={
            'Private-Token': GITLAB_API_TOKEN,
        },
    )
    commits = res.json()['commits']
    res.raise_for_status()
    if not commits:
        print('>>> No commits to submit')
        continue

    print('>>> Submitting changes from', previous_tag['name'], 'to', tag['name'])
    data = {
        'version': tag['name'],
        'ref': tag['commit']['id'],
        'url': GITLAB_URL + '/' + GITLAB_PROJECT_NAME + '/tags/' + tag['name'],
        'projects': [SENTRY_PROJECT],
        'dateReleased': tag['commit']['created_at'],
        'commits': [{
            'id': commit['id'],
            'repository': GITLAB_PROJECT_NAME,
            'message': commit['title'].strip(),
            'author_name': commit['author_name'],
            'author_email': commit['author_email'],
            'timestamp': commit['created_at'],
        } for commit in commits],
    }
    res = requests.post(
        SENTRY_API_URL + '/organizations/' + SENTRY_ORGANIZATION + '/releases/',
        json=data,
        headers={'Authorization': 'Bearer {}'.format(SENTRY_API_TOKEN)},
    )
    res.raise_for_status()
    previous_tag = tag
