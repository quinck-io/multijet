#!/usr/bin/env groovy

import hudson.tasks.junit.TestResultSummary

def notifyDiscord(String buildStatus = 'SUCCESS', String lastRunningStage ='PRE-BUILD', TestResultSummary testResult, configs) {
  def statusIcon

  def successIcons = [':unicorn:', ':man_dancing:', ':ghost:', ':dancer:', ':scream_cat:']
  def failedIcons = [':fire:', 'dizzy_face', ':man_facepalming:']
  def buildFailed = false

  if (buildStatus == 'SUCCESS') {
    def successRandomIndex = (new Random()).nextInt(successIcons.size())
    statusIcon = "${successIcons[successRandomIndex]}"
  } else {
    def failedRandomIndex = (new Random()).nextInt(failedIcons.size())
    buildFailed = true
    statusIcon = "${successIcons[failedRandomIndex]}"
  }

  //   def title = "${env.JOB_NAME} Build: ${env.BUILD_NUMBER}"
  def title_link = "${env.RUN_DISPLAY_URL}"

  def testSummary

  if (testResult) {
    testSummary = "\n *Test Summary* - ${testResult.totalCount}, Failures: ${testResult.failCount}, Skipped: ${testResult.skipCount}, Passed: ${testResult.passCount}\n\nTest link: ${env.RUN_TESTS_DISPLAY_URL}"
  }

  def author = sh(returnStdout: true, script: "git --no-pager show -s --format='%an'").trim()

  def commitTimestamp = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%cd' --date=format:'%d/%m/%Y - %H:%M:%S'").trim()
  def commitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
  def commitShortHash = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()

  def commitMessageDetail = "Commit: ${commitTimestamp}\nMessage: ${commitMessage}\nHash: ${commitShortHash}"
  def subject = "${statusIcon} Status: *${buildStatus}*"

  if (buildFailed == true) {
    subject = subject + "\n> Failed in stage: *${lastRunningStage}*"
  }

  def completeSonarURL = "${configs.sonarCloudUrl?.trim()}&branch=${env.BRANCH_NAME}"
  subject = subject + "\n\nSonar Result: ${completeSonarURL}"

  if (testResult) {
    subject = subject + "\n\nTest result: ${testSummary}"
  }

  def completeMessage
  def detailMessage = statusDetailMessage(!buildFailed, author)

  completeMessage = subject + '\n\n' + detailMessage

  if (configs.discordWebhookUrl?.trim()) {
    discordSend (description: completeMessage, footer: "${commitMessageDetail}", link: title_link, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${configs.discordWebhookUrl}")
  }
}

def statusDetailMessage(boolean success, String authorName) {
  def message

  if (success == true) {
    def messages = [":champagne::champagne:\tCongrats **${authorName}**, ci sei riuscito. :sunglasses:\t:champagne::champagne:",
    ":moyai::moyai:\tMah man **${authorName}**, you made it. :women_with_bunny_ears_partying:\t:moyai::moyai:",
    ":burrito::burrito:\t**${authorName}**, sei stato bravo. :women_with_bunny_ears_partying:\t:burrito::burrito:",
    ":pig::pig:\t **${authorName}** You son of a bitch. you did it. :women_with_bunny_ears_partying:\t:pig::pig:",
    ":ferris_wheel::ferris_wheel:\t**${authorName}** Sei un grande.\t:ferris_wheel::ferris_wheel: "]
    def randomIndex = (new Random()).nextInt(messages.size())
    message = messages[randomIndex]
  } else {
    def messages = [ ":fire::fire:\t* **${authorName}**, Sei un coglione!*\t:fire::fire:",
    ":bomb::bomb:\t*${authorName}*, Ma sarà possibile?\t:bomb::bomb:",
    ":pouting_cat: :pouting_cat: \t*${authorName}*, Ma che cazzo fai porcoddue?\t:pouting_cat: :pouting_cat:",
    ":face_vomiting::face_vomiting:\t*${authorName}*, Questo commit ha fatto piangere mia mamma!\t:face_vomiting::face_vomiting:" ]
    def randomIndex = (new Random()).nextInt(messages.size())

    message = messages[randomIndex]
  }

  return message
}

return this
