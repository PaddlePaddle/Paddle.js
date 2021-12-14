import setuptools

PY_MODILES = ["check.check"]

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="paddlejsmodelcheck",
    version="0.0.11",
    author="paddlejs",
    author_email="382248373@qq.com",
    description="Paddlejs model check",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/PaddlePaddle/Paddle.js",
    py_modules=PY_MODILES,
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    packages=["check"],
    package_data={
        "check": ["check/*.txt"]
    },
    python_requires='>=3.6',
    install_requires=[
        "paddlepaddle >= 2.0.0",
        "numpy"
    ],
    entry_points={
        "console_scripts": [
            "paddlejsmodelcheck = check.check:main"
        ]
    }
)