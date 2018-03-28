/**
 * LS-8 v2.0 emulator skeleton code
 */
const HLT = 0b00000001;
const LDI = 0b10011001;
const MUL = 0b10101010;
const PRN = 0b01000011;
const PUSH = 0b01001101;
const POP = 0b01001100;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg[7] = this.ram.read(Number(0xf4.toString()));
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                return this.reg[regA] * this.reg[regB];
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the next instruction.)

        let IR = this.ram.read(this.reg.PC);

        // Debugging output
        //console.log(`${this.reg.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME

        let operandA = this.ram.read(this.reg.PC + 1);
        let operandB = this.ram.read(this.reg.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME

        const handle_HLT = () => {
            this.stopClock();
        };

        const handle_LDI = (operandA, operandB) => {
            this.reg[operandA] = operandB;
        };

        const handle_PRN = (operandA) => {
            console.log(this.reg[operandA]);
        };

        const handle_MUL = (operandA, operandB) => {
            this.reg[operandA] =this.alu('MUL', operandA, operandB);
        };

        const handle_PUSH = () => {
            this.reg[7] -= 1;
            this.ram.write(this.reg[7], this.reg[operandA]);
        };

        const handle_POP = () => {
            this.reg[operandA] = this.ram.read(this.reg[7]);
            this.reg[7] += 1;
        };

        const handle_default = (instruction) => {
            console.log(`${instruction.toString(2)} is an unknown instruction.`);
            handle_HLT();
        };

        const branchTable = {
            [LDI]: handle_LDI,
            [PRN]: handle_PRN,
            [MUL]: handle_MUL,
            [HLT]: handle_HLT,
        };

        if(Object.keys(branchTable).includes(IR.toString())) {
            branchTable[IR](operandA, operandB);
        } else {
            handle_default(IR);
        };

        // switch (IR) {
        //     case HLT:
        //         this.stopClock();
        //         break;
        //     case LDI:
        //         this.reg[operandA] = operandB;

        //     case PRN:
        //         console.log(this.reg[operandA]);
        //         break;
        //     case MUL:
        //         this.reg[operandA] = this.alu('MUL', operandA, operandB);
        //         break;
        //     default:
        //         console.log('Unknown Instructions:' + IR.toString(2));
        //         this.stopClock();
        //         break;
        // }

        this.reg.PC += (IR >>> 6) + 1;
    }
}

module.exports = CPU;
