const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const VotingContract = artifacts.require('Voting');
contract('Voting', function(accounts){
const owner = accounts[0];
const recipient = accounts[1];
const third = accounts[2];

    beforeEach(async function(){
        this.cInstance = await VotingContract.new({from:owner});
    });

    describe("#OWNERSHIP", async function(){
        //Le contrat vient d'openZeppelin mais je tiens à tester que tout s'initialise comme prévu
        it('owner() should return accounts[0]', async function(){
            const contractOwner = await this.cInstance.owner.call();
            expect(contractOwner).to.be.equal(owner);
        });

        it('verify if modifier onlyOwner revert if recipient call an onlyOwner function', async function(){
            await expectRevert(this.cInstance.renounceOwnership.call({from:recipient}), "Ownable: caller is not the owner");
        });

        it('verify if modifier onlyOwner let owner call an onlyOwner function', async function(){
            let contractOwner = await this.cInstance.owner.call({from:owner});
            expect(contractOwner).to.be.equal(owner);
            await this.cInstance.transferOwnership(recipient, {from:owner});
            contractOwner = await this.cInstance.owner.call({from:owner});
            expect(contractOwner).to.be.equal(recipient);
        });
    });

    //j'ai mis 3 expect pour verifier en une fois toute la struc voter
    describe("#addVoter", async function(){

        it('should add a voter, and get it', async function(){
            await this.cInstance.addVoter(recipient, {from:owner});
            const voter = await this.cInstance.getVoter.call(recipient, {from:recipient});
            expect(voter.isRegistered).to.be.ok;
            expect(voter.hasVoted).to.be.false;
            expect(voter.votedProposalId).to.be.bignumber.equal(new BN(0));
        });

        it('should revert if registration is not open', async function(){
            await this.cInstance.startProposalsRegistering({from:owner});
            await expectRevert(this.cInstance.addVoter(recipient, {from:owner}), "Voters registration is not open yet");
        });

        it('should revert if owner try to register a voter twice', async function(){
            await this.cInstance.addVoter(recipient, {from:owner});
            await expectRevert(this.cInstance.addVoter(recipient, {from:owner}), "Already registered");
        });

        it('should emit an event if owner register someone', async function(){
            const event = await this.cInstance.addVoter(recipient, {from:owner});
            expectEvent(event, "VoterRegistered",{voterAddress:recipient});
        });

        it('should add 10 voters', async function(){
            for (let i = 0; i < 10; i++) {
                await this.cInstance.addVoter(accounts[i], {from:owner});
            }
            for (let i = 0; i < 10; i++) {
                const voter = await this.cInstance.getVoter.call(accounts[i],{from:owner});
                expect(voter.isRegistered).to.be.true;
            }
        });

        context('->getVoter', async function(){
            it('should revert if a non voter try to getVoter', async function(){
                await expectRevert(this.cInstance.getVoter.call(recipient, {from:owner}), "You're not a voter");
            });
        });

        context('->onlyVoters', async function(){
            it('should revert a function if called by a non voter', async function(){
                await this.cInstance.startProposalsRegistering({from:owner});
                await expectRevert(this.cInstance.addProposal('test', {from:owner}), "You're not a voter");
            });
        })
    });

    describe('#startProposalRegistering', async function(){

        it('should revert if current status isnt registeringVoters', async function(){
            await this.cInstance.startProposalsRegistering({from:owner});
            await expectRevert(this.cInstance.startProposalsRegistering({from:owner}), "Registering proposals cant be started now");
        });

        it('should change workflowStatus to ProposalsRegistrationStarted', async function(){
            await this.cInstance.startProposalsRegistering({from:owner});
            const status = await this.cInstance.workflowStatus.call();
            expect(new BN(status)).to.be.bignumber.equal(new BN(1));
        });

        it('should emit WorkflowStatusChange event', async function(){
            const event = await this.cInstance.startProposalsRegistering({from:owner});
            expectEvent(event, "WorkflowStatusChange",{previousStatus:new BN(0), newStatus:new BN(1)});
        });
    });

    describe('#addProposal', async function(){

        beforeEach(async function(){
            await this.cInstance.addVoter(owner,{from:owner});
            await this.cInstance.startProposalsRegistering({from:owner});
        });

        //2 expect pour verifier en une fois toute la struct proposal
        it('should add a legit proposal and get it', async function(){
            await this.cInstance.addProposal('test', {from:owner});
            const proposal = await this.cInstance.getOneProposal.call(0, {from:owner});
            expect(proposal.description).to.be.equal('test');
            expect(proposal.voteCount).to.be.bignumber.equal(new BN(0));
        });

        it('should revert if current status isnt ProposalsRegistrationStarted', async function(){
            await this.cInstance.endProposalsRegistering({from:owner});
            await expectRevert(this.cInstance.addProposal('test', {from:owner}), "Proposals are not allowed yet");
        });

        it('should revert if proposition is empty', async function(){
            await expectRevert(this.cInstance.addProposal('', {from:owner}), "Vous ne pouvez pas ne rien proposer");
        });

        it('should emit a ProposalRegistered event', async function(){
            const event = await this.cInstance.addProposal('test', {from:owner});
            expectEvent(event, "ProposalRegistered", {proposalId:new BN(0)});
        });

        it.skip('should add 20 propositions', async function(){
            for(let i = 0; i < 20; i++) {
                await this.cInstance.addProposal('proposition' + i, {from:owner});
            }
            for (let i = 0; i < 20; i++) {
                const proposal = await this.cInstance.getOneProposal.call(i, {from:owner});
                expect(proposal.description).to.be.equal('proposition' + i);
                expect(proposal.voteCount).to.be.bignumber.equal(new BN(0));
            }
        })
    
        context('->getOneProposal', async function(){

            it('should revert if a non voter try to getOneProposal', async function(){
                await expectRevert(this.cInstance.getOneProposal.call(0,{from:recipient}), "You're not a voter");
            });
        });
    });

    describe("#endProposalsRegistering", async function(){

        beforeEach(async function(){
            await this.cInstance.startProposalsRegistering({from:owner});
        });

        it('should revert if current status isnt ProposalsRegistrationStarted', async function(){
            this.cInstance.endProposalsRegistering({from:owner});
            await expectRevert(this.cInstance.endProposalsRegistering({from:owner}), "Registering proposals havent started yet");
        });

        it('should change workflowStatus to ProposalsRegistrationEnded', async function(){
            await this.cInstance.endProposalsRegistering({from:owner});
            const status = await this.cInstance.workflowStatus.call();
            expect(new BN(status)).to.be.bignumber.equal(new BN(2));
        });

        it('should emit WorkflowStatusChange event', async function(){
            const event = await this.cInstance.endProposalsRegistering({from:owner});
            expectEvent(event, "WorkflowStatusChange",{previousStatus:new BN(1), newStatus:new BN(2)});
        });
    });

    describe("#startVotingSession", async function(){

        beforeEach(async function(){
            await this.cInstance.startProposalsRegistering({from:owner});
            await this.cInstance.endProposalsRegistering({from:owner});
        });

        it('should revert if current status isnt ProposalsRegistrationEnded', async function(){
            await this.cInstance.startVotingSession({from:owner});
            await expectRevert(this.cInstance.startVotingSession({from:owner}), "Registering proposals phase is not finished");
        });

        it('should change workflowStatus to VotingSessionStarted', async function(){
            await this.cInstance.startVotingSession({from:owner});
            const status = await this.cInstance.workflowStatus.call();
            expect(new BN(status)).to.be.bignumber.equal(new BN(3));
        });

        it('should emit WorkflowStatusChange event', async function(){
            const event = await this.cInstance.startVotingSession({from:owner});
            expectEvent(event, "WorkflowStatusChange",{previousStatus:new BN(2), newStatus:new BN(3)});
        });
    });

    describe("#setVote", async function(){

        beforeEach(async function(){
            for (let i = 0; i < 8; i++) {
                await this.cInstance.addVoter(accounts[i], {from:owner});  
            }
            await this.cInstance.startProposalsRegistering({from:owner});
            for (let i = 0; i < 3; i++) {
                await this.cInstance.addProposal('proposition' + i, {from:accounts[i]});
            }
            await this.cInstance.endProposalsRegistering({from:owner});
        });

        it('should revert if voting session hasnt started', async function(){
            await expectRevert(this.cInstance.setVote.call(0, {from:owner}), "Voting session havent started yet");
        });

        it('should revert if a voter has alredy voted', async function(){
            await this.cInstance.startVotingSession({from:owner});
            await this.cInstance.setVote(0, {from:third});
            await expectRevert(this.cInstance.setVote(1, {from:third}), "You have already voted");
        });

        it('should revert if voter vote for inexistant proposal', async function(){
            await this.cInstance.startVotingSession({from:owner}); 
            await expectRevert(this.cInstance.setVote(4, {from:third}), "Proposal not found");
        });

        //verification de toute la struct voter + le vote count de la proposal
        it('should add and get a vote', async function(){
            await this.cInstance.startVotingSession({from:owner});
            const proposalBefore = await this.cInstance.getOneProposal.call(0,{from:owner});
            await this.cInstance.setVote(0, {from:owner});
            const proposalThen = await this.cInstance.getOneProposal.call(0,{from:owner});
            const voter = await this.cInstance.getVoter.call(owner, {from:owner});
            expect(voter.hasVoted).to.be.ok;
            expect(voter.votedProposalId).to.be.bignumber.equal(new BN(0));
            expect(new BN(proposalThen.voteCount)).to.be.bignumber.equal(new BN(proposalBefore.voteCount).add(new BN(1)));
        });

        it('should emit an Voted event if success', async function(){
            await this.cInstance.startVotingSession({from:owner});
            const event = await this.cInstance.setVote(0, {from:owner});
            expectEvent(event, "Voted", {voter:owner, proposalId:new BN(0)});
        });
    });

    describe("#endVotingSession", async function(){

        beforeEach(async function(){
            await this.cInstance.startProposalsRegistering({from:owner});
            await this.cInstance.endProposalsRegistering({from:owner});
            await this.cInstance.startVotingSession({from:owner});
        });

        it('should revert if current status isnt VotingSessionEnded', async function(){
            await this.cInstance.endVotingSession({from:owner});
            await expectRevert(this.cInstance.endVotingSession({from:owner}), "Voting session havent started yet");
        });

        it('should change workflowStatus to VotingSessionEnded', async function(){
            await this.cInstance.endVotingSession({from:owner});
            const status = await this.cInstance.workflowStatus.call();
            expect(new BN(status)).to.be.bignumber.equal(new BN(4));
        });

        it('should emit WorkflowStatusChange event', async function(){
            const event = await this.cInstance.endVotingSession({from:owner});
            expectEvent(event, "WorkflowStatusChange",{previousStatus:new BN(3), newStatus:new BN(4)});
        });
    });

    describe("#tallyVotes", async function(){

        beforeEach(async function(){
            //registering 8 voters
            for (let i = 0; i < 8; i++) {
                await this.cInstance.addVoter(accounts[i], {from:owner});  
            }
            await this.cInstance.startProposalsRegistering({from:owner});
            //adding 3 proposals
            for (let i = 0; i < 3; i++) {
                await this.cInstance.addProposal('proposition' + i, {from:accounts[i]});
            }
            await this.cInstance.endProposalsRegistering({from:owner});
            //setting 2 votes for proposal0, 3 for proposal1, 2 for proposal2
            await this.cInstance.startVotingSession({from:owner});
             for (let i = 0; i < 2; i++) {
                await this.cInstance.setVote(new BN(0), {from:accounts[i]});
            }
            for (let i = 2; i < 5; i++) {
                await this.cInstance.setVote(new BN(1), {from:accounts[i]});
               
            }
            for (let i = 5; i < 7; i++) {
                await this.cInstance.setVote(new BN(2), {from:accounts[i]});
                
            } 
        });

        it('should revert if current status isnt VotingSessionEnded', async function(){
            await expectRevert(this.cInstance.tallyVotes.call({from:owner}), "Current status is not voting session ended");
        });

        it('should store the right winner in winningProposalId', async function(){
            await this.cInstance.endVotingSession({from:owner});
            await this.cInstance.tallyVotes({from:owner});
            const winner = await this.cInstance.winningProposalID.call({from:owner});
            expect(new BN(winner)).to.be.bignumber.equal(new BN(1));
        });

        it('default winner in case of equality is the smallest proposalID', async function(){
            await this.cInstance.setVote(2,{from:accounts[7]});
            await this.cInstance.endVotingSession({from:owner});
            await this.cInstance.tallyVotes({from:owner});
            const winner = await this.cInstance.winningProposalID.call({from:owner});
            expect(new BN(winner)).to.be.bignumber.equal(new BN(1));
        });

        it('should change the workflowStatus to VotesTallied', async function(){
            await this.cInstance.endVotingSession({from:owner});
            await this.cInstance.tallyVotes({from:owner});
            const status = await this.cInstance.workflowStatus.call();
            expect(new BN(status)).to.be.bignumber.equal(new BN(5));
        });

        it('should emit a WorkflowStatusChange', async function(){
            await this.cInstance.endVotingSession({from:owner});
            const event = await this.cInstance.tallyVotes({from:owner});
            expectEvent(event, "WorkflowStatusChange", {previousStatus:new BN(4), newStatus:new BN(5)});
        });
    });
});