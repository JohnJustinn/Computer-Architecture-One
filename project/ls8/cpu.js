/**
 * LS-8 v2.0 emulator skeleton code
 */
const HLT = 0b00000001;
const LDI = 0b10011001;
const MUL = 0b10101010;
const PRN = 0b01000011;
const PUSH = 0b01001101;
const POP = 0b01001100;
const CALL = 0b01001000;
const RET = 0b00001001;
const ADD = 0b10101000;
const CMP = 0b10100000;
const JEQ = 0b01010001;
const JMP = 0b01010000;
const JNE = 0b01010010;

const equalFlag = 0;

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
        this.reg[7] = 0xF4;
        this.reg.FL = 0;
    }

    checkFlag(flag) {
        return (this.reg.FL & (1 << flag)) >> flag;
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
            case 'ADD':
                return this.reg[regA] + this.reg[regB];
                break
            case 'CMP':
                if (regA === regB) {
                    this.reg.FL |= (1 << equalFlag);
                } else {
                    this.reg.FL &= ~(1 << equalFlag);
                }
                break
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

        const handle_LDI = (register, value) => {
            this.reg[register] = value;
        };

        const handle_PRN = (register) => {
            console.log(this.reg[register]);
        };

        const handle_MUL = (registerA, registerB) => {
            this.reg[registerA] = this.alu('MUL', registerA, registerB);
        };

        const handle_ADD = (registerA, registerB) => {
            this.reg[registerA] = this.alu('ADD', registerA, registerB);
        }

        const handle_PUSH = (register) => {
            this.ram.write(--this.reg[7], this.reg[register]);
        };

        const handle_POP = (register) => {
            this.reg[register] = this.ram.read(this.reg[7]++);
        };

        const handle_CALL = (register) => {
            this.ram.write(--this.reg[7], this.reg.PC + 2);
            this.reg.PC = this.reg[register];
        }

        const handle_RET = () => {
            this.reg.PC = this.ram.read(this.reg[7]++);
        }

        const handle_default = (instruction) => {
            console.log(`${instruction.toString(2)} is not understood, use a valid instruction`);
            handle_HLT();
        };



        const branchTable = {
            [LDI]: handle_LDI,
            [PRN]: handle_PRN,
            [MUL]: handle_MUL,
            [HLT]: handle_HLT,
            [PUSH]: handle_PUSH,
            [POP]: handle_POP,
            [CALL]: handle_CALL,
            [RET]: handle_RET,
            [ADD]: handle_ADD,
        };

        if (Object.keys(branchTable).includes(IR.toString())) {
            branchTable[IR](operandA, operandB);
        } else {
            handle_default(IR);
        };

        // switch (IR) {
        //     case HLT:
        //         this.stopClock();
        //         break;
        //     case LDI:
        //         this.reg[registerA] = operandB;

        //     case PRN:
        //         console.log(this.reg[registerA]);
        //         break;
        //     case MUL:
        //         this.reg[registerA] = this.alu('MUL', registerA, operandB);
        //         break;
        //     default:
        //         console.log('Unknown Instructions:' + IR.toString(2));
        //         this.stopClock();
        //         break;
        // }

        switch (IR) {
            case CALL:
            case RET:
                break;
            default:
                this.reg.PC += (IR >>> 6) + 1;
                break;
        }
    }
}

module.exports = CPU;
