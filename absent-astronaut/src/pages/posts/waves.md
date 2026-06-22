---
layout: ../../layouts/BlogPost.astro
title: "Rendering the Ocean with OpenGL"
author: "Joel Meuleman"
date: "2025-06-12"
tags: ["coding", "opengl", "blog", "graphics", "software"]
# image: "/assets/images/featured-image.jpg"
alt: "Descriptive alt text for the featured image"
description: "Rendering an ocean scene bit by bit"
draft: false
---

# Rendering the Ocean with OpenGL

## Introduction

I’ve always enjoyed staring at the ocean. But what if we had the ocean at home on the computer? This is the question I bravely asked as I set out to implement an OpenGL program to mimic the ocean.

## Why OpenGL? ( also some vocab)

**OpenGL** - Low level cross-platform graphics programming API.

**Shader** - Program that runs on the GPU.

---

Why suffer through the pain of using OpenGL instead of using a higher-level graphics framework or library? As an engineer, wanting to know how things work is inherent to who I am. Programming at a low-ish level like this provides several benefits: it forces me to think harder about making my own abstractions, and it teaches me about (in)efficiencies with different implementations. Both these skills come in handy when debugging code made with higher level tools.

_As an aside, this post is not about teaching OpenGL basics, but rather about how a complex looking graphic can be from small simple pieces._

## Step by Step Implementation

### Initial Planning

To begin, I should mention we’ll be doing the rendering through rasterization (as opposed to ray tracing/marching). This means we’ll be describing a scene in 3D space, then doing some algebra to project this 3D world onto a 2D plane which determines our pixel colours. To render this scene, I'll generate a plane of vertices, then displace these vertices with a wave function. Later, I'll put this plane in a skybox when it's time to make the waves look a bit more realistic with reflections. The final executable will utilize 2 shader programs: one to render the waves, and one to render the background.

### Rendering a Plane

Let’s first start by generating points for and rendering a simple plane. We generate evenly spaced points and record their index ordering for passing to the EBO for rendering.

In the vertex shader, I displace the vertical position with a sine function $$p = (x,sin(x,z), z)$$ In the fragment shader, I assign a purple colour to each pixel in the mesh. Finally, I displace the camera slightly so we can view the plane.
<video src="/resources/posts/waves/wave.mov" controls muted loop playsinline></video>

We have a wave! We can see we have motion and depth, but it would be nice if we had a bit of lighting off the surface of the mesh, so that we can better tell what’s going on.

### Lighting

For this shader program, I chose to implement [Blinn-Phong](https://learnopengl.com/Lighting/Basic-Lighting) lighting. This is a fundamental lighting model in computer graphics, and it's extensible for adding later lighting features. There are 3 aspects to Blinn Phong lighting: ambient, specular, and diffuse light.

To begin implementing this lighting method, the surface normal for each vertex is required. Thankfully, as we have a simple function for the displacement of each vertex, we have a simple derivative that will give us the **exact** normal for each vertex $$dy/dx = cos(x)$$ Using the normal as calculated in the vertex shader we calculate the lighting contribution for each pixel.
<video src="/resources/posts/waves/lit-wave.mov" controls muted loop playsinline></video>
Nice! With the basic lighting done, we can implement more complex wave patterns.

### Improving the Wave Displacement Algorithm

With the basics out of the way, it's time to look at more realistic wave algorithms for displacing our plane vertices. [GPU Gems](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models) describes how we can achieve more complex looking waves using a sum of sines calculation.
$$ y=\sum*{i = 0}^{N}{f(x)} \hspace{12pt} \text{and} \hspace{12pt} \frac{dy}{dx}=\sum*{i = 0}^{N}{f'(x)} $$
Thankfully, the derivative of the sum equals the sum of the derivative, which means we can more or less wrap our displacement and normal calculations in a loop. After adding some pseudo randomly generated wave parameters, and summing just 4 waves, we arrive at this animation.
<video src="/resources/posts/waves/ss.mov" controls muted loop playsinline></video>

Then, we change our wave function to one with steeper peaks and lower troughs by updating the displacement and normal computations in the vertex shader.

$$
W_i(x, z, t) = 2A_i \times \left( \frac{\sin(\mathbf{D}_i \cdot (x, z) \times w_i + t \times \varphi_i) + 1}{2} \right)^k
$$

$$
\frac{\partial}{\partial x}(W_i(x, z, t)) = k \times \mathbf{D}_i.x \times w_i \times A_i \times \left( \frac{\sin(\mathbf{D}_i \cdot (x, z) \times w_i + t \times \varphi_i) + 1}{2} \right)^{k-1} \times \cos(\mathbf{D}_i \cdot (x, z) \times w_i + t \times \varphi_i).
$$

This surface has more complexity, and we can spend time tweaking values to get exactly what we want later.
<video src="/resources/posts/waves/ss-exp.mov" controls muted loop playsinline></video>

### Adding a Skybox and Reflections

In this stage, we add more realism to our surface by adding an atmosphere to view in the distance. To be somewhat realistic, this atmosphere must also be reflected off the surface of the water.

We implement the skybox as a separate shader. We define a box surrounding our wave plane, and map a nice sky picture to it. In the fragment shader of the wave shader, we sample the skybox texture to determine what colour to reflect off the surface pixel. After implementing these changes, we arrive at this <video src="/resources/posts/waves/skybox.mov" controls muted loop playsinline></video>

With some more tweaks that I'll write about later (mostly stolen from [Acerola's video](https://www.youtube.com/watch?v=PH9q0HNBjT4&t=1054s)) I got this animation.
<video src="/resources/posts/waves/tweaked-params.mov" controls muted loop playsinline></video>

### Conclusion

Over the course of a couple sections, we've shown how we can implement a complex looking animation through little more than some basic calculus and linear algebra. I'll likely post a follow-up blog where I implement a more realistic wave function, but this seems like a good place to stop without adding too much extra detail.

## References

[GPU Gems](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models)

[Acerola](https://www.youtube.com/watch?v=PH9q0HNBjT4&t=1054s)
