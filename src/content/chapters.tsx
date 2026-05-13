import type { ReactNode } from 'react';
import { InteractiveCode } from '../components/InteractiveCode';
import { Mermaid } from '../components/Mermaid';

export interface Chapter {
  id: string;
  title: string;
  content: ReactNode;
}

export const chapters: Chapter[] = [
  {
    id: 'scoping-closures',
    title: '1. Scoping & The Mechanics of Closures',
    content: (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          The Anatomy of a Closure
        </h1>
        <p>
          At a graduate level, we must move beyond the "nested function" definition and explore the <strong>Python Data Model</strong>. 
          The core of a decorator is the <strong>Closure</strong>—a function object that remembers values in enclosing scopes even if those scopes are no longer in memory.
        </p>
        
        <div className="bg-slate-900/50 border-l-4 border-emerald-500 p-8 my-10 rounded-r-2xl shadow-xl">
          <h3 className="text-emerald-400 font-bold mt-0 flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Internal Architecture</span>
            Cell Objects and Free Variables
          </h3>
          <p className="text-sm text-slate-300 mb-0 italic">
            When Python's compiler sees a nested function referencing a variable in an outer scope, it marks that variable as a <strong>free variable</strong>. 
            Instead of storing it on the stack, it creates a <strong>cell object</strong> on the heap. This allows the variable to persist across function calls.
          </p>
        </div>

        <h3>Interactive Lab: Inspecting __closure__</h3>
        <p>
          Let's use Python's introspection capabilities to peek into the <code>__closure__</code> attribute. 
          This is where the magic lives.
        </p>
        <InteractiveCode initialCode={`
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()

# Inspecting the closure
print(f"Function object: {counter}")
print(f"Closure cells: {counter.__closure__}")
if counter.__closure__:
    print(f"Cell content (count): {counter.__closure__[0].cell_contents}")

print(f"First call: {counter()}")
print(f"Updated cell content: {counter.__closure__[0].cell_contents}")
        `} />

        <div className="my-16">
          <h3 className="text-center text-slate-500 uppercase tracking-widest text-xs mb-8">Closure Execution Flow</h3>
          <Mermaid chart={`
sequenceDiagram
    participant OS as Outer Function (Stack)
    participant Heap as Memory (Heap)
    participant IS as Inner Function Object
    
    Note over OS: outer() initialized
    OS->>Heap: Allocate Cell for 'x'
    OS->>IS: Create __closure__ link to Cell
    Note over OS: outer() returns & terminates
    Note over OS: Stack Frame Pop
    Note over IS: inner() called later
    IS->>Heap: Access 'x' via Cell
    IS-->>IS: Execute logic
          `} />
        </div>
      </div>
    )
  },
  {
    id: 'syntax-definition',
    title: '2. Decorator Syntax: Timing & Evaluation',
    content: (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1>Evaluation Time Dynamics</h1>
        <p>
          A common misconception is that decorators run when the decorated function is called. 
          In reality, decorators are executed at <strong>import/definition time</strong>.
        </p>
        
        <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-xl my-10">
          <p className="text-sm text-amber-200 mb-0">
            <strong>Key takeaway:</strong> The <code>@decorator</code> syntax is syntactic sugar for <code>func = decorator(func)</code>. 
            This transformation happens as soon as the module is loaded.
          </p>
        </div>

        <InteractiveCode initialCode={`
def registry(func):
    print(f"--- Registering {func.__name__} during definition ---")
    return func

@registry
def task_a():
    print("Executing Task A")

@registry
def task_b():
    print("Executing Task B")

print("\\n--- System Initialization Complete ---")
task_a()
        `} />

        <h3>The Metadata Preservation Problem</h3>
        <p>
          When you wrap a function, you replace it with a wrapper function. 
          This causes the original function's <code>__name__</code>, <code>__doc__</code>, and <code>__annotations__</code> to be lost unless you use <code>functools.wraps</code>.
        </p>
        <InteractiveCode initialCode={`
import functools

def analyzer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        """Analyze logic here"""
        return func(*args, **kwargs)
    return wrapper

@analyzer
def complex_math(x: int) -> int:
    """Performs complex graduate-level math."""
    return x ** 2

print(f"Metadata check for '{complex_math.__name__}':")
print(f" - Documentation: {complex_math.__doc__}")
print(f" - Annotations: {complex_math.__annotations__}")
        `} />
      </div>
    )
  },
  {
    id: 'factories',
    title: '3. Decorator Factories: Parameterized Logic',
    content: (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1>Higher-Order Decorators</h1>
        <p>
          To pass arguments to a decorator, we must implement a <strong>Decorator Factory</strong>. 
          This is a function that returns a decorator, which in turn returns a wrapper.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <h4 className="text-emerald-400 mb-4 font-bold">The 3-Layer Model</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-emerald-500 font-mono">1.</span>
                <span><strong>Factory:</strong> Receives configuration arguments.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-mono">2.</span>
                <span><strong>Decorator:</strong> Receives the target function.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-mono">3.</span>
                <span><strong>Wrapper:</strong> Receives the execution arguments.</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 p-6 font-mono text-xs text-slate-500">
            Factory(args) {'->'} Decorator(func) {'->'} Wrapper(*args)
          </div>
        </div>

        <InteractiveCode initialCode={`
import time
import functools

def retry(times, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {i+1} failed: {e}. Retrying...")
                    time.sleep(delay)
            return func(*args, **kwargs)
        return wrapper
    return decorator

@retry(times=3, delay=0.5)
def unstable_network():
    import random
    if random.random() < 0.7:
        raise ConnectionError("Network timeout")
    return "Data Packets Received"

print(unstable_network())
        `} />
      </div>
    )
  },
  {
    id: 'descriptors',
    title: '4. The Descriptor Protocol: Method Binding',
    content: (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1>Solving the Method Binding Problem</h1>
        <p>
          Class-based decorators often fail when applied to instance methods because they don't know how to handle the <code>self</code> argument. 
          This is where the <strong>Descriptor Protocol</strong> and the <code>__get__</code> method come in.
        </p>

        <div className="bg-blue-900/10 border border-blue-500/20 p-8 my-10 rounded-2xl">
          <h3 className="text-blue-400 mt-0 font-bold underline">The __get__ Mechanism</h3>
          <p className="text-sm text-slate-300 mb-0">
            When you access an attribute on an instance (<code>obj.method</code>), Python checks if the attribute has a <code>__get__</code> method. 
            If it does, it's a <strong>descriptor</strong>. Functions are descriptors; their <code>__get__</code> returns a <strong>Bound Method</strong> object that prepends <code>self</code> to the call.
          </p>
        </div>

        <h3>Building a Robust Universal Decorator</h3>
        <InteractiveCode initialCode={`
import types
import functools

class UniversalLogger:
    def __init__(self, func):
        self.func = func
        functools.update_wrapper(self, func)

    def __call__(self, *args, **kwargs):
        # This handles standard function calls
        print(f"[LOG] Executing standalone: {self.func.__name__}")
        return self.func(*args, **kwargs)

    def __get__(self, instance, owner):
        if instance is None:
            return self
        # Create a bound method to handle 'self' correctly
        print(f"[LOG] Binding {self.func.__name__} to {instance}")
        return types.MethodType(self, instance)

class Processor:
    @UniversalLogger
    def compute(self, value):
        return value * 2

p = Processor()
print(f"Result: {p.compute(10)}")
        `} />
      </div>
    )
  },
  {
    id: 'performance-bytecode',
    title: '5. Performance & Bytecode Analysis',
    content: (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1>The Cost of Abstraction</h1>
        <p>
          As a graduate student, you must evaluate the performance impact of decorators. 
          Every decorator layer adds a new function call and a new stack frame. 
          In tight loops, this overhead can be measured using the <code>dis</code> module.
        </p>

        <InteractiveCode initialCode={`
import dis

def null_decorator(f):
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)
    return wrapper

def raw_func(x):
    return x + 1

@null_decorator
def deco_func(x):
    return x + 1

print("--- Raw Function Bytecode ---")
dis.dis(raw_func)

print("\\n--- Decorated Function Bytecode (Wrapper) ---")
dis.dis(deco_func)
        `} />
        
        <div className="mt-12 p-8 bg-emerald-950/20 rounded-3xl border border-emerald-500/20 text-center">
          <h2 className="text-white mt-0">Thesis Conclusion</h2>
          <p className="text-slate-400 mb-0">
            Decorators are not just "syntactic sugar"—they are powerful metaprogramming hooks that leverage closures, the descriptor protocol, and Python's dynamic evaluation model. 
            Used wisely, they enable a clean, declarative architecture.
          </p>
        </div>
      </div>
    )
  }
];
