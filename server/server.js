// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { Pool } = require('pg');

// const app = express();
// const PORT = 8000;

// app.use(cors());
// app.use(bodyParser.json());

// // DB connection
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// // ✅ Login / Validate School
// app.post('/vinterbash/validate', async (req, res) => {
//   const { schoolName, password } = req.body;
//   try {
//     const result = await pool.query(
//       'SELECT * FROM schools WHERE school_name = $1', [schoolName]
//     );
//     if (result.rows.length === 0)
//       return res.status(404).json({ error: 'School not found' });

//     const school = result.rows[0];
//     if (school.password !== password)
//       return res.status(401).json({ error: 'Invalid password' });

//     const events = await pool.query('SELECT * FROM events ORDER BY event_id');
//     const regEvents = await pool.query(
//       'SELECT e.event_name FROM school_event_registrations ser JOIN events e ON ser.event_id = e.event_id WHERE ser.school_id = $1',
//       [school.school_id]
//     );

//     return res.json({
//       schoolName: school.school_name,
//       schoolId: school.school_id,
//       events: events.rows,
//       eventsReg: regEvents.rows.map(r => r.event_name)
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get all events
// app.get('/vinterbash/getAllEvents', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM events ORDER BY event_id');
//     res.json({ eventNames: result.rows.map(r => r.event_name) });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Register a team for an event
// app.post('/vinterbash/register', async (req, res) => {
//   const { eventId, eventName, schoolId, teamName, participants } = req.body;
//   try {
//     const teamResult = await pool.query(
//       'INSERT INTO teams (school_id, event_id, team_name) VALUES ($1, $2, $3) RETURNING team_id',
//       [schoolId, eventId, teamName]
//     );
//     const teamId = teamResult.rows[0].team_id;

//     for (const name of participants) {
//       await pool.query(
//         'INSERT INTO participants (team_id, participant_name) VALUES ($1, $2)',
//         [teamId, name]
//       );
//     }

//     await pool.query(
//       `INSERT INTO school_event_registrations (school_id, event_id, status)
//        VALUES ($1, $2, 'full')
//        ON CONFLICT (school_id, event_id) DO UPDATE SET status = 'full'`,
//       [schoolId, eventId]
//     );

//     res.send('Successfully registered team!');
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get teams for a specific event for a school
// app.post('/vinterbash/events', async (req, res) => {
//   const { schoolName, activeEvent } = req.body;
//   try {
//     const schoolResult = await pool.query(
//       'SELECT school_id FROM schools WHERE school_name = $1', [schoolName]
//     );
//     if (schoolResult.rows.length === 0)
//       return res.status(404).json({ error: 'School not found' });

//     const schoolId = schoolResult.rows[0].school_id;

//     const eventResult = await pool.query(
//       'SELECT event_id FROM events WHERE event_name = $1', [activeEvent]
//     );
//     if (eventResult.rows.length === 0)
//       return res.status(404).json({ error: 'Event not found' });

//     const eventId = eventResult.rows[0].event_id;

//     const teams = await pool.query(
//       'SELECT * FROM teams WHERE school_id = $1 AND event_id = $2',
//       [schoolId, eventId]
//     );

//     const teamsWithParticipants = await Promise.all(
//       teams.rows.map(async (team) => {
//         const parts = await pool.query(
//           'SELECT * FROM participants WHERE team_id = $1', [team.team_id]
//         );
//         return { ...team, participants: parts.rows };
//       })
//     );

//     res.json({ eventName: activeEvent, eventId, teams: teamsWithParticipants });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get registration summary counts
// app.post('/vinterbash/registeredEvents', async (req, res) => {
//   const { schoolId } = req.body;
//   try {
//     const total = await pool.query('SELECT COUNT(*) FROM events');
//     const registered = await pool.query(
//       'SELECT COUNT(*) FROM school_event_registrations WHERE school_id = $1', [schoolId]
//     );
//     const regCount = parseInt(registered.rows[0].count);
//     const totalCount = parseInt(total.rows[0].count);

//     res.json({
//       fullyRegistered: regCount,
//       notRegistered: totalCount - regCount
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get all participants and their events for a school
// app.post('/vinterbash/eventParticipantMap', async (req, res) => {
//   const { schoolName } = req.body;
//   try {
//     const result = await pool.query(
//       `SELECT p.participant_name, e.event_name
//        FROM participants p
//        JOIN teams t ON p.team_id = t.team_id
//        JOIN schools s ON t.school_id = s.school_id
//        JOIN events e ON t.event_id = e.event_id
//        WHERE s.school_name = $1`,
//       [schoolName]
//     );
//     res.json({ participants: result.rows });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Save teacher info
// app.post('/vinterbash/teacherRegister', async (req, res) => {
//   const { schoolId, teacher1name, teacher1number, teacher2name, teacher2number } = req.body;
//   try {
//     await pool.query('DELETE FROM teachers WHERE school_id = $1', [schoolId]);
//     await pool.query(
//       'INSERT INTO teachers (school_id, teacher_name, teacher_number) VALUES ($1,$2,$3),($1,$4,$5)',
//       [schoolId, teacher1name, teacher1number, teacher2name, teacher2number]
//     );
//     res.send('Inserted Successfully');
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get teacher info
// app.post('/vinterbash/teacherInfo', async (req, res) => {
//   const { schoolId } = req.body;
//   try {
//     const result = await pool.query(
//       'SELECT * FROM teachers WHERE school_id = $1 ORDER BY teacher_id', [schoolId]
//     );
//     const [t1, t2] = result.rows;
//     res.json({
//       teacher1name: t1?.teacher_name,
//       teacher1number: t1?.teacher_number,
//       teacher2name: t2?.teacher_name,
//       teacher2number: t2?.teacher_number,
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get all events
// app.get('/vinterbash/getAllEvents', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM events ORDER BY event_id');
//     res.json({ eventNames: result.rows.map(r => r.event_name) });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));

const express = require("express");
const cors = require("cors");
const pool = require("./db_setup");
const crypto = require("crypto");

// ============================================================================
// 1. App Configuration
// ============================================================================
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// ============================================================================
// 2. DTOs (JSDoc)
// ============================================================================

/**
 * @typedef {Object} ParticipantDTO
 * @property {string} participantId
 * @property {string} participantName
 */

/**
 * @typedef {Object} EventDTO
 * @property {string} eventId
 * @property {string} eventName
 */

/**
 * @typedef {Object} EventTeamDTO
 * @property {string} teamId
 * @property {string} teamName
 * @property {string} schoolName
 * @property {ParticipantDTO[]} participants
 */

/**
 * @typedef {Object} EventWithTeamsDTO
 * @property {string} eventId
 * @property {string} eventName
 * @property {EventTeamDTO[]} teams
 */

/**
 * @typedef {Object} ValidateRequest
 * @property {string} schoolName
 * @property {string} password
 */

/**
 * @typedef {Object} ValidateResponse
 * @property {string} schoolName
 * @property {string} schoolId
 * @property {Array} events
 * @property {Array} eventsReg
 */

/**
 * @typedef {Object} TeamRegistrationRequest
 * @property {string} schoolId
 * @property {string} eventId
 * @property {string} teamId
 * @property {ParticipantDTO[]} participants
 */

/**
 * @typedef {Object} UpdateRequest
 * @property {string} teamId
 * @property {ParticipantDTO[]} participants
 */

/**
 * @typedef {Object} TeacherRegistrationRequest
 * @property {string} schoolId
 * @property {string} teacher1Name
 * @property {string} teacher1Phone
 * @property {string} teacher2Name
 * @property {string} teacher2Phone
 */

/**
 * @typedef {Object} OrganiserValidateRequest
 * @property {string} organiserName
 * @property {string} password
 */

/**
 * @typedef {Object} OrganiserValidateResponse
 * @property {string} organiserName
 * @property {string} organiserId
 * @property {string} role
 * @property {Object} assignedEvents
 */

/**
 * @typedef {Object} EnterResultsRequest
 * @property {string} event_id
 * @property {string} team_id
 * @property {number} position
 */

// ============================================================================
// 3. Constants
// ============================================================================
const POSITION_POINTS = { 1: 10, 2: 7, 3: 5 };

// ============================================================================
// 4. Database Queries
// ============================================================================
const Queries = {
  // --- School ---
  VALIDATE_SCHOOL: `
    SELECT school_id FROM schools
    WHERE school_name = $1 AND password = $2`,

  GET_ALL_EVENTS: `
    SELECT event_name AS "eventName", event_id AS "eventId"
    FROM events`,

  GET_SCHOOL_EVENT_REGISTRATION_STATUS: `
    SELECT s.school_id, s.school_name, e.event_id, e.max_teams_per_school,
           COUNT(t.team_id) AS registered_teams
    FROM schools s
    CROSS JOIN events e
    LEFT JOIN teams t ON t.school_id = s.school_id AND t.event_id = e.event_id
    WHERE s.school_id = $1
    GROUP BY s.school_id, s.school_name, e.event_id, e.max_teams_per_school`,

  GET_SCHOOL_REGISTERED_EVENTS: `
    SELECT s.school_id, s.school_name, e.event_id, e.event_name,
           e.max_teams_per_school, COUNT(t.team_id) AS registered_teams
    FROM schools s
    CROSS JOIN events e
    LEFT JOIN teams t ON t.school_id = s.school_id AND t.event_id = e.event_id
    WHERE s.school_id = $1
    GROUP BY s.school_id, s.school_name, e.event_id, e.event_name, e.max_teams_per_school
    HAVING COUNT(t.team_id) >= 1
    ORDER BY e.event_name ASC`,

  INSERT_SCHOOL: `
    INSERT INTO schools (school_id, school_name)
    VALUES ($1, (SELECT school_name FROM schools WHERE school_id = $1))
    ON CONFLICT (school_id) DO NOTHING`,

  INSERT_TEAM: `
    INSERT INTO teams (team_id, event_id, school_id, team_name)
    VALUES ($1, $2, $3, $4)`,

  INSERT_PARTICIPANT: `
    INSERT INTO participants (participant_id, team_id, participant_name)
    VALUES ($1, $2, $3)`,

  UPSERT_PARTICIPANT: `
    INSERT INTO participants (participant_id, participant_name, team_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (participant_id)
    DO UPDATE SET participant_name = EXCLUDED.participant_name,
                  team_id = EXCLUDED.team_id`,

  GET_PARTICIPANTS_AND_EVENTS_BY_SCHOOL: `
    SELECT p.participant_name AS "participantName", e.event_name AS "eventName"
    FROM participants p
    JOIN teams t ON p.team_id = t.team_id
    JOIN events e ON t.event_id = e.event_id
    JOIN schools s ON t.school_id = s.school_id
    WHERE s.school_name = $1`,

  GET_EVENT_DETAILS: `
    SELECT e.event_id, e.event_name, t.team_id, t.team_name,
           p.participant_id, p.participant_name, s.school_name
    FROM schools s
    JOIN teams t ON s.school_id = t.school_id
    JOIN events e ON t.event_id = e.event_id
    JOIN participants p ON t.team_id = p.team_id
    WHERE s.school_name = $1 AND e.event_name = $2
    ORDER BY t.team_id, p.participant_id`,

  GET_ADMIN_EVENT_DETAILS: `
    SELECT e.event_id, e.event_name, t.team_id, t.team_name,
           p.participant_id, p.participant_name, s.school_name
    FROM schools s
    LEFT JOIN teams t ON s.school_id = t.school_id
    LEFT JOIN events e ON t.event_id = e.event_id AND e.event_name = $1
    LEFT JOIN participants p ON t.team_id = p.team_id
    WHERE e.event_id IS NOT NULL
    ORDER BY s.school_name, t.team_id, p.participant_id`,

  REGISTER_TEACHERS: `
    UPDATE schools
    SET teacher1name = $1, teacher2name = $2,
        teacher1number = $3, teacher2number = $4
    WHERE school_id = $5`,

  GET_TEACHER_INFO: `
    SELECT teacher1name, teacher1number, teacher2name, teacher2number
    FROM schools WHERE school_id = $1`,

  // --- Organiser ---
  VALIDATE_ORGANISER: `
    SELECT organizer_id FROM organizers
    WHERE organizer_name = $1 AND password = $2`,

  GET_ASSIGNED_EVENTS_BY_ORG: `
    SELECT
      e.event_id   AS "eventId",
      e.event_name AS "eventName",
      s.school_name AS "schoolName",
      t.team_name   AS "teamName",
      t.team_id     AS "teamId",
      p.participant_name AS "memberName"
    FROM organizers o
    JOIN events e ON o.event_id = e.event_id
    LEFT JOIN teams t ON e.event_id = t.event_id
    LEFT JOIN schools s ON t.school_id = s.school_id
    LEFT JOIN participants p ON t.team_id = p.team_id
    WHERE o.organizer_id = $1`,

  // --- Results ---
  UPSERT_RESULT: `
    INSERT INTO team_results (result_id, event_id, team_id, position, points)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (result_id)
    DO UPDATE SET position = EXCLUDED.position,
                  points   = EXCLUDED.points`,

  // --- EnterResults dropdowns ---
  GET_SCHOOLS_FOR_EVENT: `
    SELECT DISTINCT s.school_id AS "schoolId", s.school_name AS "schoolName"
    FROM schools s
    JOIN teams t ON s.school_id = t.school_id
    WHERE t.event_id = $1
    ORDER BY s.school_name ASC`,

  GET_TEAMS_FOR_SCHOOL_EVENT: `
    SELECT t.team_id          AS "teamId",
           t.team_name        AS "teamName",
           p.participant_id   AS "participantId",
           p.participant_name AS "participantName"
    FROM teams t
    JOIN participants p ON t.team_id = p.team_id
    WHERE t.school_id = $1 AND t.event_id = $2
    ORDER BY t.team_id, p.participant_id`,
};

// ============================================================================
// 5. Helper Functions
// ============================================================================
const filterRegisteredEventBySchool = (registrations) =>
  registrations.map((r) => r.event_name);

function buildEventWithTeams(rows, eventName) {
  const event = { eventId: null, eventName, teams: [] };
  if (!rows.length) return event;

  const teamMap = new Map();
  rows.forEach((row) => {
    if (!event.eventId) {
      event.eventId = row.event_id;
      event.eventName = row.event_name;
    }
    const { team_id, team_name, participant_id, participant_name, school_name } = row;
    if (team_id && !teamMap.has(team_id)) {
      teamMap.set(team_id, {
        teamId: team_id,
        teamName: team_name,
        schoolName: school_name,
        participants: [],
      });
      event.teams.push(teamMap.get(team_id));
    }
    if (participant_id) {
      teamMap.get(team_id).participants.push({
        participantId: participant_id,
        participantName: participant_name,
      });
    }
  });
  return event;
}

function buildAssignedEvent(rows) {
  if (!rows.length) return null;

  const eventData = {
    eventId: rows[0].eventId,
    eventName: rows[0].eventName,
    participants: [],
  };

  const teamMap = {};
  rows.forEach((row) => {
    const key = `${row.schoolName}_${row.teamName}`;
    if (!teamMap[key]) {
      teamMap[key] = {
        schoolName: row.schoolName,
        teamId: row.teamId,
        teamName: row.teamName,
        members: [],
      };
    }
    if (row.memberName) teamMap[key].members.push(row.memberName);
  });

  eventData.participants = Object.values(teamMap);
  return eventData;
}

// ============================================================================
// 6. Routes
// ============================================================================
const router = express.Router();

// --- School Auth ---
router.post("/validate", async (req, res) => {
  try {
    const { schoolName, password } = req.body;
    const schoolRes = await pool.query(Queries.VALIDATE_SCHOOL, [schoolName, password]);
    if (!schoolRes.rows.length)
      return res.status(401).json({ error: "Invalid credentials" });

    const schoolId = schoolRes.rows[0].school_id;
    const [eventsRes, registeredRes] = await Promise.all([
      pool.query(Queries.GET_ALL_EVENTS),
      pool.query(Queries.GET_SCHOOL_REGISTERED_EVENTS, [schoolId]),
    ]);

    return res.status(200).json({
      schoolId,
      schoolName,
      events: eventsRes.rows,
      eventsReg: filterRegisteredEventBySchool(registeredRes.rows),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Organiser Auth ---
router.post("/organiserValidate", async (req, res) => {
  try {
    const { organiserName, password } = req.body;

    const organiserRes = await pool.query(Queries.VALIDATE_ORGANISER, [organiserName, password]);
    if (!organiserRes.rows.length)
      return res.status(401).json({ error: "Invalid credentials" });

    const organiserId = organiserRes.rows[0].organizer_id;
    const assignedEventsRes = await pool.query(Queries.GET_ASSIGNED_EVENTS_BY_ORG, [organiserId]);
    const assignedEvent = buildAssignedEvent(assignedEventsRes.rows);

    return res.status(200).json({
      organiserId,
      organiserName,
      role: "organiser",
      assignedEvents: assignedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Registration ---
router.post("/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const { schoolId, eventId, teamId, participants } = req.body;
    const teamName = `${schoolId}${teamId}`;

    await client.query("BEGIN");
    await client.query(Queries.INSERT_SCHOOL, [schoolId]);
    await client.query(Queries.INSERT_TEAM, [teamId, eventId, schoolId, teamName]);
    for (const p of participants) {
      await client.query(Queries.INSERT_PARTICIPANT, [p.participantId, teamId, p.participantName]);
    }
    await client.query("COMMIT");
    res.status(200).send(`Successfully registered for event: ${eventId}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

router.post("/updateTeamParticipants", async (req, res) => {
  const client = await pool.connect();
  try {
    const { teamId, participants } = req.body;
    await client.query("BEGIN");
    for (const p of participants) {
      await client.query(Queries.UPSERT_PARTICIPANT, [p.participantId, p.participantName, teamId]);
    }
    await client.query("COMMIT");
    res.status(200).send("Updated successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

router.post("/teacherRegister", async (req, res) => {
  try {
    const { schoolId, teacher1Name, teacher1Phone, teacher2Name, teacher2Phone } = req.body;
    await pool.query(Queries.REGISTER_TEACHERS, [
      teacher1Name, teacher2Name, teacher1Phone, teacher2Phone, schoolId,
    ]);
    res.status(200).send(`Teachers registered successfully for school ${schoolId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Results ---
router.post("/enterResults", async (req, res) => {
  try {
    const { event_id, team_id, position } = req.body;

    if (!POSITION_POINTS[position])
      return res.status(400).json({ error: "Position must be 1, 2, or 3" });

    const points    = POSITION_POINTS[position];
    const result_id = `${event_id}_${team_id}`;

    await pool.query(Queries.UPSERT_RESULT, [result_id, event_id, team_id, position, points]);
    res.status(200).json({ message: "Results entered successfully.", points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- EnterResults Dropdowns ---
router.post("/schoolsForEvent", async (req, res) => {
  try {
    const { eventId } = req.body;
    const { rows } = await pool.query(Queries.GET_SCHOOLS_FOR_EVENT, [eventId]);
    res.status(200).json({ schools: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/teamsForSchoolEvent", async (req, res) => {
  try {
    const { schoolId, eventId } = req.body;
    const { rows } = await pool.query(Queries.GET_TEAMS_FOR_SCHOOL_EVENT, [schoolId, eventId]);

    const teamMap = new Map();
    rows.forEach((row) => {
      if (!teamMap.has(row.teamId)) {
        teamMap.set(row.teamId, {
          teamId:       row.teamId,
          teamName:     row.teamName,
          participants: [],
        });
      }
      teamMap.get(row.teamId).participants.push({
        participantId:   row.participantId,
        participantName: row.participantName,
      });
    });

    res.status(200).json({ teams: Array.from(teamMap.values()) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Events & Participants ---
router.post("/registeredEvents", async (req, res) => {
  try {
    const { schoolId } = req.body;
    const { rows } = await pool.query(Queries.GET_SCHOOL_EVENT_REGISTRATION_STATUS, [schoolId]);
    if (!rows.length)
      return res.status(404).send("School ID not found or no events available.");

    let fully = 0, partially = 0, none = 0, schoolName = null;
    rows.forEach((row) => {
      const registered = parseInt(row.registered_teams, 10);
      const max        = parseInt(row.max_teams_per_school, 10);
      if (registered === 0) none++;
      else if (registered < max) partially++;
      else fully++;
      schoolName = row.school_name;
    });

    res.status(200).json({
      schoolId,
      schoolName,
      fullyRegistered:     fully,
      partiallyRegistered: partially,
      notRegistered:       none,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const { schoolName, activeEvent } = req.body;
    const queryStr    = schoolName === "admin" ? Queries.GET_ADMIN_EVENT_DETAILS : Queries.GET_EVENT_DETAILS;
    const queryParams = schoolName === "admin" ? [activeEvent] : [schoolName, activeEvent];

    const { rows } = await pool.query(queryStr, queryParams);
    res.status(200).json(buildEventWithTeams(rows, activeEvent));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/eventParticipantMap", async (req, res) => {
  try {
    const { schoolName } = req.body;
    const { rows } = await pool.query(Queries.GET_PARTICIPANTS_AND_EVENTS_BY_SCHOOL, [schoolName]);
    if (!rows.length)
      return res.status(404).send(`Not found: ${schoolName}`);
    res.status(200).json({ participants: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllEvents", async (req, res) => {
  try {
    const { rows } = await pool.query(Queries.GET_ALL_EVENTS);
    res.status(200).json({ eventNames: rows.map((r) => r.eventName) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/teacherInfo", async (req, res) => {
  try {
    const { schoolId } = req.body;
    const { rows } = await pool.query(Queries.GET_TEACHER_INFO, [schoolId]);
    if (!rows.length)
      return res.status(404).json({ error: "Teacher info not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================================
// 7. Mount & Listen
// ============================================================================
app.use("/vinterbash", router);

app.listen(PORT, () => {
  console.log(`🚀 Vinterbash backend running on http://localhost:${PORT}`);
});