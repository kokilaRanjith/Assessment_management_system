// Configuration for assessment types. Add new assessment types here without code changes.
// Supports:
// - sections per assessment_id
// - fields with labels, units, jsonPath, optional formatter
// - classification rules with ranges

export const assessmentsConfig = {
as_hr_02: {
name: 'Health & Fitness Assessment',
sections: [
{
id: 'key_vitals',
title: 'Key Body Vitals',
fields: [
{ label: 'Overall Health Score', unit: '%', jsonPath: '$.accuracy' },
{ label: 'Heart Rate', unit: 'bpm', jsonPath: '$.vitalsMap.vitals.heart_rate' },
{ label: 'Blood Pressure Systolic', unit: 'mmHg', jsonPath: '$.vitalsMap.vitals.bp_sys' },
{ label: 'Blood Pressure Diastolic', unit: 'mmHg', jsonPath: '$.vitalsMap.vitals.bp_dia' }
]
},
{
id: 'heart_health',
title: 'Heart Health',
fields: [
{ label: 'Wellness Score', unit: '', jsonPath: '$.vitalsMap.wellness_score', classify: 'wellness' },
{ label: 'Stress Index', unit: '', jsonPath: '$.vitalsMap.metadata.heart_scores.stress_index', classify: 'stress' }
]
},
{
id: 'stress_level',
title: 'Stress Level',
fields: [
{ label: 'RMSSD', unit: '', jsonPath: '$.vitalsMap.metadata.heart_scores.rmssd' },
{ label: 'SDNN', unit: '', jsonPath: '$.vitalsMap.metadata.heart_scores.sdnn' }
]
},
{
id: 'fitness_levels',
title: 'Fitness Levels',
fields: [
{ label: 'Cardiovascular Endurance (Jog test time)', unit: 'sec', jsonPath: '$.exercises[?(@.id==235)].setList[0].time' }
]
},
{
id: 'posture',
title: 'Posture',
fields: [
{ label: 'Posture Status', unit: '', jsonPath: '$.vitalsMap.posture' }
]
},
{
id: 'body_comp',
title: 'Body Composition',
fields: [
{ label: 'BMI', unit: '', jsonPath: '$.bodyCompositionData.BMI', classify: 'bmi' },
{ label: 'Body Fat %', unit: '%', jsonPath: '$.vitalsMap.metadata.physiological_scores.bodyfat' }
]
}
]
},
as_card_01: {
name: 'Cardiac Assessment',
sections: [
{
id: 'key_vitals',
title: 'Key Body Vitals',
fields: [
{ label: 'Overall Health Score', unit: '%', jsonPath: '$.accuracy' },
{ label: 'Heart Rate', unit: 'bpm', jsonPath: '$.vitalsMap.vitals.heart_rate' },
{ label: 'Blood Pressure Systolic', unit: 'mmHg', jsonPath: '$.vitalsMap.vitals.bp_sys' },
{ label: 'Blood Pressure Diastolic', unit: 'mmHg', jsonPath: '$.vitalsMap.vitals.bp_dia' }
]
},
{
id: 'cardio_endurance',
title: 'Cardiovascular Endurance',
fields: [
{ label: 'Jog Test Time', unit: 'sec', jsonPath: '$.exercises[?(@.id==235)].setList[0].time' }
]
},
{
id: 'body_comp',
title: 'Body Composition',
fields: [
{ label: 'BMI', unit: '', jsonPath: '$.bodyCompositionData.BMI', classify: 'bmi' }
]
}
]
},
// DEMONSTRATION: New assessment type added via configuration only
as_mental_01: {
name: 'Mental Health Assessment',
sections: [
{
id: 'basic_info',
title: 'Basic Information',
fields: [
{ label: 'Assessment Score', unit: '%', jsonPath: '$.accuracy' },
{ label: 'Age', unit: 'years', jsonPath: '$.age' },
{ label: 'Gender', unit: '', jsonPath: '$.gender' }
]
},
{
id: 'mental_health',
title: 'Mental Health Metrics',
fields: [
{ label: 'Anxiety Level', unit: '', jsonPath: '$.mentalHealth.anxiety', classify: 'anxiety' },
{ label: 'Depression Score', unit: '', jsonPath: '$.mentalHealth.depression', classify: 'depression' },
{ label: 'Stress Level', unit: '', jsonPath: '$.mentalHealth.stress', classify: 'stress' }
]
},
{
id: 'lifestyle',
title: 'Lifestyle Factors',
fields: [
{ label: 'Sleep Quality', unit: '', jsonPath: '$.lifestyle.sleepQuality', classify: 'sleep' },
{ label: 'Exercise Frequency', unit: 'times/week', jsonPath: '$.lifestyle.exercise' },
{ label: 'Social Support', unit: '', jsonPath: '$.lifestyle.socialSupport', classify: 'support' }
]
}
]
}
}

// Classification dictionaries
export const classifications = {
bmi: [
{ max: 18.5, label: 'Underweight' },
{ min: 18.5, max: 24.9, label: 'Normal' },
{ min: 25, max: 29.9, label: 'Overweight' },
{ min: 30, label: 'Obese' }
],
stress: [
{ max: 1, label: 'Low' },
{ min: 1, max: 2, label: 'Moderate' },
{ min: 2, label: 'High' }
],
wellness: [
{ max: 50, label: 'Needs Attention' },
{ min: 50, max: 75, label: 'Average' },
{ min: 75, label: 'Good' }
],
// DEMONSTRATION: New classification ranges added via configuration only
anxiety: [
{ max: 3, label: 'Low' },
{ min: 3, max: 6, label: 'Moderate' },
{ min: 6, label: 'High' }
],
depression: [
{ max: 4, label: 'Minimal' },
{ min: 4, max: 8, label: 'Mild' },
{ min: 8, max: 12, label: 'Moderate' },
{ min: 12, label: 'Severe' }
],
sleep: [
{ max: 3, label: 'Poor' },
{ min: 3, max: 6, label: 'Fair' },
{ min: 6, label: 'Good' }
],
support: [
{ max: 2, label: 'Low' },
{ min: 2, max: 4, label: 'Moderate' },
{ min: 4, label: 'High' }
]
}

// Styling config (optional)
export const theme = {
brand: {
primary: '#0ea5e9',
text: '#0f172a'
}
}
