# Adaptive Graph Completion Report

## Execution Summary
- Zero-network-call confirmed: True
- Trace successful: True
- Nodes in Graph: 14
- Edges in Graph: 7
- Nodes traversed in trace: 7
- Edges traversed in trace: 6

## Traced Objects
- **Recommendation** (`recommendation:1`): Do not proceed....
- **ChallengeFinding** (`challenge_finding:1`): Revised...
- **ChallengeFinding** (`challenge_finding:2`): Revised...
- **ChallengeTask** (`challenge_task:1`): Evaluate this signal: Unresolved evidence conflict...
- **ChallengeTask** (`challenge_task:2`): Evaluate this signal: Material recommendation depe...
- **EscalationSignal** (`escalation_signal:1`): Unresolved evidence conflict: CLAIM_CONTRADICTS_CL...
- **EscalationSignal** (`escalation_signal:2`): Material recommendation depends on unverified crit...

## Traced Edges
- `challenge_finding:1` --[FINDING_AFFECTS_RECOMMENDATION]--> `recommendation:1`
- `challenge_finding:2` --[FINDING_AFFECTS_RECOMMENDATION]--> `recommendation:1`
- `challenge_task:1` --[CHALLENGE_PRODUCES_FINDING]--> `challenge_finding:1`
- `challenge_task:2` --[CHALLENGE_PRODUCES_FINDING]--> `challenge_finding:2`
- `escalation_signal:1` --[SIGNAL_TRIGGERS_TASK]--> `challenge_task:1`
- `escalation_signal:2` --[SIGNAL_TRIGGERS_TASK]--> `challenge_task:2`
