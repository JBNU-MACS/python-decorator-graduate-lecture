import React from 'react';
import InteractiveCode from '../components/InteractiveCode';
import Mermaid from '../components/Mermaid';

export interface Chapter {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const chapters: Chapter[] = [
  {
    id: 'intro-deep',
    title: '1. Scoping, Closures, and the Python Data Model',
    content: (
      <div>
        <h1 className="text-4xl font-extrabold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          The Anatomy of a Closure
        </h1>
        <p className="text-lg leading-relaxed mb-6 text-slate-300">
          At a graduate level, we don't just say "a function within a function." We must understand the <strong>Python Data Model</strong> and how names are resolved via the <strong>LEGB</strong> (Local, Enclosing, Global, Built-in) rule.
        </p>
        
        <div className="bg-slate-900 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg shadow-lg">
          <h3 className="text-emerald-400 font-bold mt-0 flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-900 text-xs px-2 py-0.5 rounded-full uppercase">Theory</span>
            Internal Insight: Cell Objects
          </h3>
          <p className="text-sm text-slate-300 mb-0">
            When a nested function references a variable in an outer scope, Python creates a <strong>cell object</strong>. 
            This object acts as a container for the variable, allowing it to persist even after the outer function's stack frame is destroyed. 
            This is the physical reality of a closure in the CPython implementation.
          </p>
        </div>

        <h2>Lab 1.1: Inspecting the Internal State</h2>
        <p>
          In this interactive sandbox, we won't just run code; we'll inspect the <code>__closure__</code> attribute to see how Python "remembers" state.
        </p>
        <InteractiveCode initialCode={`
def outer(x):
    message = f"Closure captured: {x}"
    def inner():
        return message
    return inner

func = outer("Graduate Level Depth")

# Let's inspect the closure internals
print(f"Function object: {func}")
print(f"Closure attribute: {func.__closure__}")
if func.__closure__:
    cell = func.__closure__[0]
    print(f"Cell content: {cell.cell_contents}")

print(f"Result: {func()}")
        `} />

        <div className="my-10 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold text-slate-200 mb-6 text-center">Execution Flow Visualization</h3>
          <Mermaid chart={`
sequenceDiagram
    participant OS as Outer Scope
    participant IS as Inner Scope
    participant CO as Cell Object (Heap)
    
    Note over OS: outer(x) called
    OS->>CO: Create cell for 'x'
    OS->>IS: Define inner()
    Note over IS: inner remembers CO
    OS->>OS: Return inner function object
    Note over OS: outer's stack frame POPPED
    Note over IS: inner() executed later
    IS->>CO: Fetch 'x' from cell
    IS->>IS: Return result
          `} />
        </div>

        <div className="bg-rose-900/20 border border-rose-500/30 p-6 rounded-lg mt-8">
          <h3 className="text-rose-400 mt-0 flex items-center gap-2">
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full uppercase">Challenge</span>
            The Late Binding Trap
          </h3>
          <p className="text-slate-300">
            Explain why the following code prints <code>2, 2, 2</code> instead of <code>0, 1, 2</code>, and fix it using a default argument trick.
          </p>
          <InteractiveCode initialCode={`
def create_multipliers():
    return [lambda x: i * x for i in range(3)]

multipliers = create_multipliers()
# Each lambda captures the variable 'i', not its current value!
print("Current result:", [m(10) for m in multipliers])

# YOUR FIX HERE:
# def create_fixed():
#     return [lambda x, i=i: i * x for i in range(3)]
          `} />
        </div>
      </div>
    )
  },
  {
    id: 'syntax-meta',
    title: '2. Decorator Syntax: Beyond the Sugar',
    content: (
      <div>
        <h1 className="text-white">The Metaprogramming Hook</h1>
        <p>
          Decorators are Python's primary tool for <strong>Aspect-Oriented Programming (AOP)</strong>. 
          They allow us to inject cross-cutting concerns (logging, security, caching) without polluting the core logic.
        </p>

        <div className="bg-amber-900/20 border border-amber-500/30 p-6 my-8 rounded-lg">
          <h3 className="text-amber-400 mt-0 font-bold underline">Crucial Concept: Definition Time vs Runtime</h3>
          <p className="text-sm text-slate-300 mb-0">
            The <code>@</code> operator is evaluated at <strong>Definition Time</strong> (when the module is imported). 
            This makes decorators extremely powerful for registration patterns and API discovery.
          </p>
        </div>

        <InteractiveCode initialCode={`
def register(func):
    print(f"DEBUG: Registering {func.__name__} during import/definition")
    return func

@register
def my_task():
    print("Running my_task")

print("--- System Ready ---")
my_task()
        `} />

        <h2>Advanced Lab: Metadata Preservation</h2>
        <p>
          A naive decorator destroys the target's identity. <code>functools.wraps</code> is actually a decorator itself that copies <code>__name__</code>, <code>__doc__</code>, and <code>__annotations__</code>.
        </p>
        <InteractiveCode initialCode={`
import functools

def analyzer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        """Wrapper docstring"""
        print(f"Analyzing {func.__name__} signature...")
        return func(*args, **kwargs)
    return wrapper

@analyzer
def compute(x: int) -> int:
    """Computes a value."""
    return x ** 2

print(f"Function Name: {compute.__name__}")
print(f"Docstring: {compute.__doc__}")
print(f"Annotations: {compute.__annotations__}")
        `} />
      </div>
    )
  },
  {
    id: 'factories-complex',
    title: '3. Higher-Order Logic: Decorator Factories',
    content: (
      <div>
        <h1 className="text-white">Parameterizing Transformations</h1>
        <p>
          How do we pass arguments to a decorator? By creating a function that returns a decorator. 
          This adds a third layer to our mental model: 
          <code>Factory(args) -> Decorator(func) -> Wrapper(*args)</code>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-10">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-emerald-400 font-bold mb-4">Complexity Breakdown</h3>
            <ul className="space-y-4">
              <li>
                <span className="font-mono text-cyan-400">Layer 1 (Outer)</span>: 
                Accepts configuration (e.g., log level, timeout).
              </li>
              <li>
                <span className="font-mono text-cyan-400">Layer 2 (Middle)</span>: 
                The actual decorator that receives the target function.
              </li>
              <li>
                <span className="font-mono text-cyan-400">Layer 3 (Inner)</span>: 
                The wrapper that intercepts the call and applies logic.
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-inner">
            <Mermaid chart={`
graph TD
    A[Factory: access_level='admin'] --> B[Decorator: func]
    B --> C[Wrapper: *args, **kwargs]
    C --> D{Check Permission}
    D -- Pass --> E[Call Original func]
    D -- Fail --> F[Raise Exception]
            `} />
          </div>
        </div>

        <h2>Lab 3.1: Building a Rate Limiter</h2>
        <p>
          Implement a stateful decorator that restricts how often a function can be called. 
          This uses <code>nonlocal</code> to track state across multiple calls.
        </p>
        <InteractiveCode initialCode={`
import time
import functools

def rate_limit(seconds):
    def decorator(func):
        last_called = 0
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal last_called
            elapsed = time.time() - last_called
            if elapsed < seconds:
                print(f"Hold on! Wait {seconds - elapsed:.2f}s more.")
                return None
            last_called = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(seconds=2)
def ping():
    print("Pong!")

ping()
ping() # Should be limited
time.sleep(2.1)
ping() # Should work
        `} />
      </div>
    )
  },
  {
    id: 'descriptor-binding',
    title: '4. The Descriptor Protocol: Solving Method Binding',
    content: (
      <div>
        <h1 className="text-white">When Decorators Meet Objects</h1>
        <p>
          Class-based decorators (classes using <code>__call__</code>) have a critical flaw: 
          they don't know how to bind to instances when used on methods. 
          To fix this, we must implement the <strong>Descriptor Protocol</strong>.
        </p>

        <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg my-8">
          <h3 className="text-blue-400 mt-0 flex items-center gap-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full uppercase">Protocol</span>
            The Mechanics of __get__
          </h3>
          <p className="text-sm text-slate-300 mb-0">
            When you access <code>obj.method</code>, Python checks if <code>method</code> has a <code>__get__</code> method. 
            Functions are descriptors; when accessed via an instance, their <code>__get__</code> returns a "bound method" that automatically prepends <code>self</code> to the arguments.
          </p>
        </div>

        <h2>Lab 4.1: The Universal Decorator</h2>
        <p>
          This robust implementation works for both standalone functions and class methods by explicitly handling the binding process.
        </p>
        <InteractiveCode initialCode={`
import types
import functools

class UniversalTrace:
    def __init__(self, func):
        self.func = func
        functools.update_wrapper(self, func)
        
    def __call__(self, *args, **kwargs):
        print(f"[LOG] Calling {self.func.__name__} with {args}")
        return self.func(*args, **kwargs)
        
    def __get__(self, instance, owner):
        if instance is None:
            return self
        # Create a bound method prepending 'instance' (self)
        print(f"DEBUG: Binding to instance {instance}")
        return types.MethodType(self, instance)

class Processor:
    @UniversalTrace
    def process(self, data):
        return f"Result: {data}"

p = Processor()
print(p.process("Graduate Thesis"))
        `} />
      </div>
    )
  },
  {
    id: 'real-world-patterns',
    title: '5. Real-World Architecture: Cache & Registry',
    content: (
      <div>
        <h1 className="text-white">Architectural Patterns</h1>
        <p>
          In large-scale Python systems, decorators are indispensable for building <strong>Plugin Registries</strong> and <strong>Memoization</strong> layers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-emerald-400 mt-0">Memoization</h3>
                <p className="text-sm text-slate-400">Trading memory for speed by caching pure function results.</p>
                <InteractiveCode initialCode={`
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

print(f"Fib(30): {fib(30)}")
                `} />
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-cyan-400 mt-0">Registry</h3>
                <p className="text-sm text-slate-400">Decoupling API definition from implementation.</p>
                <InteractiveCode initialCode={`
class API:
    def __init__(self):
        self.endpoints = {}
    def register(self, path):
        def deco(f):
            self.endpoints[path] = f
            return f
        return deco

api = API()
@api.register("/v1/status")
def status(): return "OK"

print(f"Endpoints: {list(api.endpoints.keys())}")
                `} />
            </div>
        </div>
      </div>
    )
  },
  {
    id: 'byte-code',
    title: '6. Performance & Bytecode Analysis',
    content: (
      <div>
        <h1 className="text-white">Under the Hood: dis.dis()</h1>
        <p>
          Every abstraction has a cost. Every wrapper is a new function call, requiring a new frame object on the stack.
        </p>

        <InteractiveCode initialCode={`
import dis

def deco(f):
    def w(): return f()
    return w

def original():
    return 42

@deco
def decorated():
    return 42

print("--- Original Bytecode ---")
dis.dis(original)
print("\\n--- Decorated Bytecode ---")
dis.dis(decorated)
        `} />
        
        <p className="mt-8 p-4 bg-emerald-900/10 border-l-4 border-emerald-500 text-slate-400 italic">
          <strong>Graduate Tip:</strong> In high-performance tight loops, 
          decorators can add significant overhead. 
          Advanced developers sometimes "unwrap" functions for critical paths using <code>func.__wrapped__</code>.
        </p>
        
        <div className="mt-12 text-center p-12 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-emerald-500/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">You've Reached the Core</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
                You now understand not just the syntax of decorators, but the underlying data model, descriptor protocol, and performance implications that define a Python expert.
            </p>
            <div className="flex justify-center gap-4">
                <div className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold">Thesis Complete</div>
                <div className="px-6 py-2 bg-slate-800 text-slate-400 rounded-full">Score: 100%</div>
            </div>
        </div>
      </div>
    )
  }
];
