---
layout: documentation
title: Bang Commands
weight: 3
nav: docs
---

Bang Commands
=============
"Bang commands" (called such because they start with a bang "!") are used in *Smelt* 
to implement powerful custom commands. Some are built into *Smelt*, others can be added using 
the plugins feature.

Built in commands
=================

Loops and events
----------------

### Explanation
Commands for *loops* (20-ticks-per-second continous commands) and *events* (run-once commands) are built into 
*Smelt*. These bang commands require the `bang-commands-setup.mcc` module to be installed into your map. 
You will be prompted to do this by *Smelt* when using them.

The custom commands use Minecraft's scoreboard tag feature to work. 
The setup module created an entity named "OC-SYSTEM", and this entity runs the loops and events. 

For example; if there is a loop named 'GameRunning', the OC-SYSTEM entity will be tagged 'loop_GameRunning' 
while the loop is active. For an event named 'StartGame' to run, OC-SYSTEM will be tagged 'event_StartGame'.

----

### The `!loop` command
Usage: `!loop <loopName>`

This command is used define a 20-ticks-per-second continous looping chain of commands. 
The commands following the loop command will be preceded by a conditional repeating command block that 
will only execute if `!start_loop` has been called in the previous tick. 


	!loop GameRunning
		>{"type":"chain", "conditional":false}
		/scoreboard players tag @a remove HasSpeed
		/scoreboard players tag @a add HasSpeed {ActiveEffects:[{Id:1b}]}
		/effect @a[tag=!HasSpeed] minecraft:speed 1 3 true

----

### The `!start_loop` command
Usage: `!start_loop <loopName>`

This command is used to start a loop (defined using `!loop`) in the next tick. 
When started, the loop will continue until `!stop_loop` is called.


	# TURN ON PAINT
	>{"type":"impulse", "auto":false}
		!start_loop Paint
		>{"type":"chain", "auto":true}
			/say TURNED ON PAINT


----

### The `!stop_loop` command
Usage: `!stop_loop <loopName>`

This command is used to stop a loop (defined using `!loop`) in the next tick. 


	# TURN ON PAINT
	>{"type":"impulse", "auto":false}
		!stop_loop Paint
		>{"type":"chain", "auto":true}
			/say TURNED OFF PAINT

----

### The `!event` command
Usage: `!event <eventName>`

This command is used define a run-once chain of commands. 
The commands following the event command will be preceded by a conditional repeating command block that 
will only execute if `!start_event` has been called in the previous tick. 


	# CYCLE POWERUPS
	!event CyclePowerups
		>{"type":"chain", "conditional":false}
		/scoreboard players set @e[name=SYSTEM] countdown 600
		/execute @r[tag=randomPowerUp] ~ ~ ~ blockdata ~ ~ ~ {auto:1b}
		/execute @e[tag=randomPowerUp] ~ ~ ~ blockdata ~ ~ ~ {auto:0b}


----

### The `!start_event` command
Usage: `!start_event <eventName>`

This command is used to start an event (defined using `!event`) in the next tick. 


	# TURN ON POWERUPS
	>{"type":"impulse", "auto":false}
		!start_event CyclePowerups
		>{"type":"chain", "auto":true}
		!start_loop Powerups
			/say TURNED ON PAINT

---

Manage scoreboard objectives
----------------------------

### The `!reset_objective` command
Usage: `!reset_objective <objective> <criteria>`

This command is used to destroy and re-create a scoreboard objective in one command. Useful for setup chains.


	!reset_objective lobbyStatus dummy LOBBY STATUS
	
	
Mathematical expressions
------------------------

### The `!math` command
Usage: `!math <objective>.<selector> <operator> <expression`
This command can be used to create complex mathematical expressions. Normal mathematical operator precendence applies. e.g. `3 + 4 * 5` is `23` but `(3 + 4) * 5` is `35`.

	/scoreboard objectives add money dummy
	!math money.@r += 100
	!math money.Notch = (money.@r * 100 + 42) / 10
