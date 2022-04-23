# Tests Voting.sol
https://www.loom.com/share/26a58b7d1b144b19b5626ef2a192b08b
### Contract: Voting

    #OWNERSHIP
      ✓ owner() should return accounts[0]
      ✓ verify if modifier onlyOwner revert if recipient call an onlyOwner function
      ✓ verify if modifier onlyOwner let owner call an onlyOwner function (29018 gas)
    #addVoter
      ✓ should add a voter, and get it (50196 gas)
      ✓ should revert if registration is not open (74384 gas)
      ✓ should revert if owner try to register a voter twice (79176 gas)
      ✓ should emit an event if owner register someone (50196 gas)
      ✓ should add 10 voters (501948 gas)
      ->getVoter
        ✓ should revert if a non voter try to getVoter
      ->onlyVoters
        ✓ should revert a function if called by a non voter (72692 gas)
    #startProposalRegistering
      ✓ should revert if current status isnt registeringVoters (73686 gas)
      ✓ should change workflowStatus to ProposalsRegistrationStarted (47653 gas)
      ✓ should emit WorkflowStatusChange event (47653 gas)
    #addProposal
      ✓ should add a legit proposal and get it (76560 gas)
      ✓ should revert if current status isnt ProposalsRegistrationStarted (57825 gas)
      ✓ should revert if proposition is empty (27975 gas)
      ✓ should emit a ProposalRegistered event (76560 gas)
      ✓ should add 20 propositions (1208340 gas)
      ->getOneProposal
        ✓ should revert if a non voter try to getOneProposal
    #endProposalsRegistering
      ✓ should revert if current status isnt ProposalsRegistrationStarted (56630 gas)
      ✓ should change workflowStatus to ProposalsRegistrationEnded (30575 gas)
      ✓ should emit WorkflowStatusChange event (30575 gas)
    #startVotingSession
      ✓ should revert if current status isnt ProposalsRegistrationEnded (56540 gas)
      ✓ should change workflowStatus to VotingSessionStarted (30530 gas)
      ✓ should emit WorkflowStatusChange event (30530 gas)
    #setVote
      ✓ should revert if voting session hasnt started
      ✓ should revert if a voter has alredy voted (115330 gas)
      ✓ should revert if voter vote for inexistant proposal (59360 gas)
      ✓ should add and get a vote (88634 gas)
      ✓ should emit an Voted event if success (88634 gas)
    #endVotingSession
      ✓ should revert if current status isnt VotingSessionEnded (56498 gas)
      ✓ verify if workflowStatus after == 4 (30509 gas)
      ✓ should emit WorkflowStatusChange event (30509 gas)
    #tallyVotes
      ✓ should revert if current status isnt VotingSessionEnded
      ✓ should store the right winner in winningProposalId (94050 gas)
      ✓ default winner in case of equality is the smallest proposalID (154966 gas)
      ✓ should change the workflowStatus to VotesTallied (94050 gas)
      ✓ should emit a WorkflowStatusChange (94050 gas)

## Gas report

![gas reporting](https://github.com/amsteradams/truffle-Voting/blob/main/capture-ethGasReporting-voting.PNG)

## Coverage 

![gas reporting](https://github.com/amsteradams/truffle-Voting/blob/main/coverage.PNG)