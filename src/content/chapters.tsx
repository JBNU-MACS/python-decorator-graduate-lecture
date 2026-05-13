export interface Chapter {
  id: string;
  title: string;
  content: React.ReactNode;
}

import React from 'react';
import InteractiveCode from '../components/InteractiveCode';
import Mermaid from '../components/Mermaid';

export const chapters: Chapter[] = [
  {
    id: 'intro',
    title: '1. The Foundation: First-Class Functions',
    content: (
      <div>
        <h1>Python Decorators: A Graduate Perspective</h1>
        <p>
          To understand decorators at a graduate level, we must first decompose the Python function object. 
          In Python, functions are not just blocks of code; they are <strong>first-class objects</strong>.
        </p>
        <h2>First-Class Citizens</h2>
        <p>
          A first-class object is an entity which supports all the operations generally available to other entities. 
          These include being passed as an argument, returned from a function, and assigned to a variable.
        </p>
        <InteractiveCode initialCode={`
def shout(text):
    return text.upper()

def whisper(text):
    return text.lower()

def greet(func):
    # Functions as arguments
    greeting = func("Hi, I am a first-class function")
    print(greeting)

greet(shout)
greet(whisper)
        `} />
        
        <h2>Lexical Scoping and Closures</h2>
        <p>
          A <strong>closure</strong> is a function object that remembers values in enclosing scopes even if they are not present in memory.
          This is the fundamental mechanism that allows decorators to "remember" the function they are wrapping.
        </p>
        <Mermaid chart={`
graph TD
    A[Global Scope] --> B[Outer Function Scope]
    B --> C[Inner Function / Closure]
    B --> D[Enclosing Variable: x]
    C --> D
    style C fill:#0f172a,stroke:#10b981,color:#fff
        `} />
        
        <InteractiveCode initialCode={`
def make_multiplier(x):
    def multiplier(n):
        # multiplier 'closes over' x
        return x * n
    return multiplier

times3 = make_multiplier(3)
times5 = make_multiplier(5)

print(f"3 * 10 = {times3(10)}")
print(f"5 * 10 = {times5(10)}")
        `} />
      </div>
    )
  },
  {
    id: 'basics',
    title: '2. The Decorator Syntax Sugar',
    content: (
      <div>
        <h1>Under the Hood of @</h1>
        <p>
          The <code>@decorator</code> syntax is merely syntactic sugar for <code>func = decorator(func)</code>.
          This happens at <strong>import time</strong> (or definition time), not at runtime.
        </p>
        
        <InteractiveCode initialCode={`
def debug(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}")
        return func(*args, **kwargs)
    return wrapper

@debug
def add(a, b):
    return a + b

# The above is equivalent to:
# def add(a, b): return a + b
# add = debug(add)

print(add(5, 10))
        `} />

        <h2>The Metadata Problem</h2>
        <p>
          One subtle issue with decorators is that the identity of the original function is lost. 
          The <code>__name__</code> and <code>__doc__</code> attributes will point to the wrapper instead.
        </p>
        <InteractiveCode initialCode={`
import functools

def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

def good_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def example_bad():
    """Docstring for bad"""
    pass

@good_decorator
def example_good():
    """Docstring for good"""
    pass

print(f"Bad Name: {example_bad.__name__}")
print(f"Good Name: {example_good.__name__}")
        `} />
      </div>
    )
  },
  {
    id: 'advanced-closures',
    title: '3. Higher-Order Decorators',
    content: (
      <div>
        <h1>Decorators with Arguments</h1>
        <p>
          When you see <code>@decorator(arg)</code>, you are actually dealing with a <strong>decorator factory</strong>.
          The function call <code>decorator(arg)</code> returns the actual decorator, which in turn returns the wrapper.
        </p>
        <Mermaid chart={`
sequenceDiagram
    participant User
    participant Factory as Decorator Factory
    participant Deco as Actual Decorator
    participant Wrap as Wrapper Function
    
    User->>Factory: call with args
    Factory->>Deco: returns decorator
    Deco->>Wrap: wraps target function
    Wrap->>User: returns wrapper
        `} />
        
        <InteractiveCode initialCode={`
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello {name}")

greet("Alice")
        `} />
      </div>
    )
  },
  {
    id: 'class-decorators',
    title: '4. Class-Based Decorators',
    content: (
      <div>
        <h1>Stateful Decorators with Classes</h1>
        <p>
          While function-based decorators are common, classes can also serve as decorators by implementing the <code>__call__</code> dunder method.
          This is particularly useful when the decorator needs to maintain state.
        </p>
        
        <InteractiveCode initialCode={`
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
        
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call {self.count} to {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hi():
    print("Hi!")

say_hi()
say_hi()
print(f"Total calls: {say_hi.count}")
        `} />

        <h2>The "Self" Trap</h2>
        <p>
          A major pitfall of class-based decorators is using them on methods. 
          When a method is decorated with a class, the <code>self</code> instance of the target class is not automatically passed.
        </p>
        <InteractiveCode initialCode={`
class Trace:
    def __init__(self, func):
        self.func = func
    def __call__(self, *args, **kwargs):
        print(f"Tracing {self.func.__name__}")
        return self.func(*args, **kwargs)

class MyClass:
    @Trace
    def method(self, x):
        return x * 2

obj = MyClass()
try:
    print(obj.method(10))
except TypeError as e:
    print(f"Error: {e}")
    print("Note: 'self' is missing because the Trace instance is calling self.func")
        `} />
      </div>
    )
  },
  {
    id: 'decorating-classes',
    title: '5. Decorating Entire Classes',
    content: (
      <div>
        <h1>Class Decorators vs. Metaclasses</h1>
        <p>
          Decorators can be applied to classes as well as functions. 
          A class decorator takes a class as input and returns a modified class (or a completely different one).
        </p>
        
        <InteractiveCode initialCode={`
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    def __init__(self):
        print("Initializing Database")

db1 = Database()
db2 = Database()
print(f"Is same object? {db1 is db2}")
        `} />

        <h2>Comparison with __init_subclass__</h2>
        <p>
          In modern Python (3.6+), <code>__init_subclass__</code> often provides a cleaner alternative to class decorators for registration patterns.
        </p>
        <InteractiveCode initialCode={`
class Registry:
    plugins = []
    
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Registry.plugins.append(cls)

class PluginA(Registry): pass
class PluginB(Registry): pass

print(f"Registered plugins: {[p.__name__ for p in Registry.plugins]}")
        `} />
      </div>
    )
  },
  {
    id: 'descriptor-protocol',
    title: '6. The Descriptor Protocol & Decorators',
    content: (
      <div>
        <h1>Bridging the Gap: __get__</h1>
        <p>
          To fix the "Self Trap" in class-based decorators, we must implement the <strong>Descriptor Protocol</strong>.
          By defining <code>__get__</code>, we can control how the decorator behaves when accessed as an attribute of an instance.
        </p>
        
        <Mermaid chart={`
graph LR
    A[Access Instance.Method] --> B{Is Descriptor?}
    B -- Yes --> C[Call __get__]
    C --> D[Return Bound Method]
    B -- No --> E[Return Raw Object]
        `} />

        <InteractiveCode initialCode={`
import types

class TraceDescriptor:
    def __init__(self, func):
        self.func = func
    
    def __call__(self, *args, **kwargs):
        print(f"Calling raw function {self.func.__name__}")
        return self.func(*args, **kwargs)
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        # Create a bound method
        print(f"Binding {self.func.__name__} to {instance}")
        return types.MethodType(self, instance)

class MyClass:
    @TraceDescriptor
    def method(self, x):
        return x * 10

obj = MyClass()
print(obj.method(5))
        `} />
      </div>
    )
  },
  {
    id: 'performance',
    title: '7. Performance & Real-world Usage',
    content: (
      <div>
        <h1>The Cost of Abstraction</h1>
        <p>
          Every decorator adds a stack frame and function call overhead. 
          In tight loops, this can be significant. Graduate-level optimization requires understanding when to "unwrap" or use <code>functools.lru_cache</code>.
        </p>
        
        <InteractiveCode initialCode={`
import time
from functools import lru_cache

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        res = func(*args, **kwargs)
        print(f"Elapsed: {time.perf_counter() - start:.8f}s")
        return res
    return wrapper

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

print("Fibonacci with cache:")
print(fib(30))
        `} />
      </div>
    )
  },
  {
    id: 'async-decorators',
    title: '8. Asynchronous Decorators',
    content: (
      <div>
        <h1>Wrapping Coroutines</h1>
        <p>
          With the rise of <code>asyncio</code>, decorators must often handle coroutine functions. 
          A standard wrapper will fail because calling a coroutine function returns a coroutine object without executing it.
        </p>
        
        <InteractiveCode initialCode={`
import asyncio
import functools
import time

def async_timer(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = await func(*args, **kwargs)
        print(f"Async Elapsed: {time.perf_counter() - start:.8f}s")
        return result
    return wrapper

@async_timer
async def async_task():
    await asyncio.sleep(0.5)
    print("Task Complete")

# In Pyodide, we can run this directly
asyncio.run(async_task())
        `} />
      </div>
    )
  },
  {
    id: 'conclusion',
    title: '9. Metaprogramming Landscape',
    content: (
      <div>
        <h1>Choosing the Right Tool</h1>
        <p>
          Decorators are part of a larger metaprogramming landscape in Python. 
          As a graduate student, you should know when to use decorators versus alternatives.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-emerald-400 mt-0">Decorators</h3>
            <p className="text-sm">Best for modifying existing functions/classes in-place or registering them.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-emerald-400 mt-0">Metaclasses</h3>
            <p className="text-sm">Best for controlling the creation of entire hierarchies and deep structural changes.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-emerald-400 mt-0">Descriptors</h3>
            <p className="text-sm">Best for controlling attribute access and binding behavior (the magic behind @property).</p>
          </div>
        </div>

        <Mermaid chart={`
mindmap
  root((Python Metaprogramming))
    Decorators
      Function Decorators
      Class Decorators
      Decorator Factories
    Metaclasses
      __new__
      __init__
      __init_subclass__
    Protocols
      Descriptors
      Context Managers
      Iterators
        `} />
        
        <h2>The Zen of Python</h2>
        <p><em>"Explicit is better than implicit."</em></p>
        <p>
          Decorators can make code very clean, but they can also hide complexity. 
          Always ensure your decorators are well-documented and preserve metadata using <code>functools.wraps</code>.
        </p>
        
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-lg mt-12">
          <h2 className="text-emerald-400 mt-0">Final Challenge</h2>
          <p className="text-slate-300">
            Implement a decorator <code>@enforce_types</code> that checks if the arguments passed to a function match its type hints.
          </p>
          <InteractiveCode initialCode={`
import functools
import inspect

def enforce_types(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        sig = inspect.signature(func)
        bound = sig.bind(*args, **kwargs)
        for name, value in bound.arguments.items():
            expected = sig.parameters[name].annotation
            if expected is not inspect.Parameter.empty:
                if not isinstance(value, expected):
                    raise TypeError(f"{name} must be {expected}")
        return func(*args, **kwargs)
    return wrapper

@enforce_types
def repeat_string(s: str, n: int):
    return s * n

print(repeat_string("Hello", 3))
try:
    print(repeat_string("Hello", "3"))
except TypeError as e:
    print(f"Caught expected error: {e}")
          `} />
        </div>
      </div>
    )
  },
  {
    id: 'cheat-sheet',
    title: '10. Decorator Cheat Sheet',
    content: (
      <div>
        <h1>Graduate Cheat Sheet</h1>
        <p>A quick reference for common decorator patterns.</p>
        
        <div className="space-y-6">
          <section className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h3 className="text-emerald-400 mt-0">Standard Function Decorator</h3>
            <pre className="text-sm text-slate-300">
{`def deco(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Pre-execution
        result = func(*args, **kwargs)
        # Post-execution
        return result
    return wrapper`}
            </pre>
          </section>

          <section className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h3 className="text-emerald-400 mt-0">Decorator with Arguments</h3>
            <pre className="text-sm text-slate-300">
{`def deco_factory(arg):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapper
    return decorator`}
            </pre>
          </section>

          <section className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h3 className="text-emerald-400 mt-0">Universal Class Decorator (Methods + Functions)</h3>
            <pre className="text-sm text-slate-300">
{`class UniversalDeco:
    def __init__(self, func):
        self.func = func
    def __call__(self, *args, **kwargs):
        return self.func(*args, **kwargs)
    def __get__(self, instance, owner):
        if instance is None: return self
        return types.MethodType(self, instance)`}
            </pre>
          </section>
        </div>

        <div className="mt-12 p-8 bg-slate-900 rounded-xl border border-emerald-500/20 text-center">
          <h2 className="text-white mt-0">Congratulations!</h2>
          <p>You have completed the deep dive into Python Decorators.</p>
          <p className="text-slate-500 text-sm">Created for Graduate Studies in Python Software Engineering</p>
        </div>
      </div>
    )
  }
];
