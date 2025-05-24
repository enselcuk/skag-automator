function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';  // Exact name of your Search campaign
  var KEYWORDS = [                                 // List your SKAG keywords here
    'red running shoes',
    'blue basketball shoes',
    'black dress shoes'
  ];
  var CPC_BID = 1.00;                              // Default max CPC (in account currency)
  var FINAL_URL = 'https://www.example.com';       // Landing page URL

  // Ad copy templates
  var HEADLINE_1 = 'Buy {keyword} Today';
  var HEADLINE_2 = 'Free Shipping Available';
  var DESCRIPTION = 'Shop top-quality {keyword}. Limited stock—order now!';

  // === END CONFIG ===

  // 1. Select the campaign by name
  var campaignIterator = AdsApp.campaigns()
      .withCondition("Name = '" + CAMPAIGN_NAME + "'")
      .withLimit(1)
      .get();
  if (!campaignIterator.hasNext()) {
    Logger.log('ERROR: Campaign not found: ' + CAMPAIGN_NAME);
    return;
  }
  var campaign = campaignIterator.next();

  // 2. Loop through keywords to build SKAGs
  KEYWORDS.forEach(function(keyword) {
    var adGroupName = keyword.replace(/\s+/g, '_').toLowerCase();

    // Check for existing ad group to avoid duplicates
    var existing = campaign.adGroups()
        .withCondition("Name = '" + adGroupName + "'")
        .get();
    if (existing.hasNext()) {
      Logger.log('Skipping existing ad group: ' + adGroupName);
      return;
    }

    // 2a. Create a paused ad group
    var adGroupOp = campaign.newAdGroupBuilder()
        .withName(adGroupName)
        .withStatus('PAUSED')
        .withCpc(CPC_BID)
        .build();
    var adGroup = adGroupOp.getResult();

    // 2b. Add exact-match keyword
    adGroup.newKeywordBuilder()
        .withText('[' + keyword + ']')
        .withCpc(CPC_BID)
        .withFinalUrl(FINAL_URL)
        .build();

    // 2c. Create an Expanded Text Ad
    adGroup.newAd().expandedTextAdBuilder()
        .withHeadlinePart1(HEADLINE_1.replace('{keyword}', keyword))
        .withHeadlinePart2(HEADLINE_2)
        .withDescription(DESCRIPTION.replace('{keyword}', keyword))
        .withFinalUrl(FINAL_URL)
        .build();

    Logger.log('Created SKAG ad group: ' + adGroupName);
  });
}
