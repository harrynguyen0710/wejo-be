const FETCH_GAMES_QUERY = `
SELECT 
  g."Id", 
  g."SportId", 
  g."CreatedBy", 
  g."SportFormatId", 
  g."VenueId", 
  g."GameTypeId", 
  g."Area", 
  g."StartTime", 
  g."EndTime", 
  g."CreatedAt", 
  g."GameAccess", 
  g."BringEquipment", 
  g."CostShared", 
  g."GameSkill", 
  g."SkillStart", 
  g."SkillEnd", 
  g."TotalPlayer", 
  g."Status", 
  g."Description", 
  ST_AsText(g."Location")::text AS "Location", 
  ST_DistanceSphere(
    ST_SetSRID(ST_MakePoint($1, $2), 4326), 
    g."Location"
  ) AS "Distance",
  -- Get an array of non-null participant avatars
  ARRAY_AGG(u."Avatar") FILTER (WHERE u."Avatar" IS NOT NULL) AS "ParticipantAvatars",
  -- Count only participants with Status = 2 and non-null avatars
  COUNT(*) FILTER (WHERE gp."Status" = 2) AS "CurrentTotalOfPlayers"
FROM game."Game" g
LEFT JOIN game."GameParticipants" gp ON gp."GameId" = g."Id" AND gp."Status" = 2
LEFT JOIN identity."User" u ON u."Id" = gp."UserId" AND u."Avatar" IS NOT NULL
WHERE 
  g."SportId" = $3 AND
  (g."SkillStart" >= $4 OR $4 IS NULL) AND
  (g."SkillEnd" <= $5 OR $5 IS NULL) AND
  g."Status" IN (0, 1)
GROUP BY g."Id"
ORDER BY "Distance" ASC
LIMIT $6 OFFSET $7
`;

module.exports = { FETCH_GAMES_QUERY };