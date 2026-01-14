import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

interface TerminalComponentProps {
    terminalId: string;
}

export default function TerminalComponent({ terminalId }: TerminalComponentProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Create terminal instance
        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            theme: {
                background: '#0d0d0d',
                foreground: '#f8f8f2',
                cursor: '#0ea5e9',
                black: '#000000',
                red: '#ff5555',
                green: '#50fa7b',
                yellow: '#f1fa8c',
                blue: '#bd93f9',
                magenta: '#ff79c6',
                cyan: '#8be9fd',
                white: '#bfbfbf',
                brightBlack: '#4d4d4d',
                brightRed: '#ff6e67',
                brightGreen: '#5af78e',
                brightYellow: '#f4f99d',
                brightBlue: '#caa9fa',
                brightMagenta: '#ff92d0',
                brightCyan: '#9aedfe',
                brightWhite: '#e6e6e6',
            },
            scrollback: 1000,
            convertEol: true,
        });

        // Add addons
        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);

        // Open terminal
        terminal.open(terminalRef.current);
        fitAddon.fit();

        // Store references
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;

        // Welcome message
        terminal.writeln('\x1b[1;36mGUIDESOFT GENAI Terminal\x1b[0m');
        terminal.writeln('\x1b[90m━'.repeat(50) + '\x1b[0m');
        terminal.writeln('');
        terminal.writeln('\x1b[33mNote:\x1b[0m This is a simulated terminal for demonstration.');
        terminal.writeln('Full shell integration will be added in future updates.');
        terminal.writeln('');
        terminal.write('\x1b[32m$\x1b[0m ');

        // Handle input
        let currentLine = '';
        terminal.onData((data) => {
            const code = data.charCodeAt(0);

            if (code === 13) {
                // Enter key
                terminal.write('\r\n');
                handleCommand(terminal, currentLine.trim());
                currentLine = '';
                terminal.write('\x1b[32m$\x1b[0m ');
            } else if (code === 127) {
                // Backspace
                if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, -1);
                    terminal.write('\b \b');
                }
            } else if (code >= 32) {
                // Printable character
                currentLine += data;
                terminal.write(data);
            }
        });

        // Handle resize
        const handleResize = () => {
            fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            terminal.dispose();
        };
    }, [terminalId]);

    const handleCommand = (terminal: Terminal, command: string) => {
        if (!command) return;

        const args = command.split(' ');
        const cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'help':
                terminal.writeln('Available commands:');
                terminal.writeln('  help     - Show this help message');
                terminal.writeln('  clear    - Clear the terminal');
                terminal.writeln('  echo     - Echo text');
                terminal.writeln('  date     - Show current date and time');
                terminal.writeln('  whoami   - Show current user');
                terminal.writeln('');
                break;

            case 'clear':
                terminal.clear();
                break;

            case 'echo':
                terminal.writeln(args.slice(1).join(' '));
                break;

            case 'date':
                terminal.writeln(new Date().toString());
                break;

            case 'whoami':
                terminal.writeln('guidesoft-user');
                break;

            case 'ls':
                terminal.writeln('src/');
                terminal.writeln('public/');
                terminal.writeln('package.json');
                terminal.writeln('README.md');
                break;

            case 'pwd':
                terminal.writeln('/workspace');
                break;

            default:
                terminal.writeln(`\x1b[31mCommand not found: ${cmd}\x1b[0m`);
                terminal.writeln('Type "help" for available commands.');
                break;
        }
    };

    return (
        <div ref={terminalRef} className="w-full h-full" />
    );
}
